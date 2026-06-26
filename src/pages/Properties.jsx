import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../supabase'
import PropertyForm from '../components/PropertyForm'

/**
 * Properties: 物件一覧画面
 * Supabase の properties テーブルに対して SELECT / INSERT / UPDATE / DELETE を行う
 * RLS により、ログインユーザー自身が登録した物件のみ操作できる
 */
export default function Properties() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const [properties, setProperties] = useState([])
  const [fetchLoading, setFetchLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState('')

  // フォームの表示状態
  // null: 非表示, undefined: 新規登録モード, {object}: 編集モード
  const [editingProperty, setEditingProperty] = useState(null)
  const [showForm, setShowForm] = useState(false)

  // =====================================================
  // SELECT: ログインユーザーの物件一覧を取得する
  // RLS により他ユーザーのデータは自動的に除外される
  // =====================================================
  const fetchProperties = useCallback(async () => {
    setFetchLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError('物件の取得に失敗しました: ' + error.message)
    } else {
      setProperties(data)
    }
    setFetchLoading(false)
  }, [])

  // 初回マウント時に物件一覧を取得する
  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  // =====================================================
  // INSERT: 新規物件を登録する
  // user_id にログインユーザーの ID を自動セットする
  // =====================================================
  const handleCreate = async (formData) => {
    setFormLoading(true)
    setError('')

    const { error } = await supabase
      .from('properties')
      .insert({ ...formData, user_id: user.id })

    if (error) {
      setError('登録に失敗しました: ' + error.message)
    } else {
      // 登録成功後はフォームを閉じて一覧を再取得する
      setShowForm(false)
      await fetchProperties()
    }
    setFormLoading(false)
  }

  // =====================================================
  // UPDATE: 物件情報を更新する
  // RLS により自分の物件のみ更新可能
  // =====================================================
  const handleUpdate = async (formData) => {
    setFormLoading(true)
    setError('')

    const { error } = await supabase
      .from('properties')
      .update(formData)
      .eq('id', editingProperty.id)

    if (error) {
      setError('更新に失敗しました: ' + error.message)
    } else {
      // 更新成功後はフォームを閉じて一覧を再取得する
      setShowForm(false)
      setEditingProperty(null)
      await fetchProperties()
    }
    setFormLoading(false)
  }

  // =====================================================
  // DELETE: 物件を削除する
  // 削除前に確認ダイアログを表示する
  // =====================================================
  const handleDelete = async (property) => {
    if (!window.confirm(`「${property.name}」を削除しますか？`)) return

    setError('')

    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', property.id)

    if (error) {
      setError('削除に失敗しました: ' + error.message)
    } else {
      // 削除後は一覧から即時除去する（再フェッチより軽量）
      setProperties((prev) => prev.filter((p) => p.id !== property.id))
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  // 新規登録フォームを開く
  const openCreateForm = () => {
    setEditingProperty(null)
    setShowForm(true)
  }

  // 編集フォームを開く
  const openEditForm = (property) => {
    setEditingProperty(property)
    setShowForm(true)
  }

  // フォームを閉じる
  const closeForm = () => {
    setShowForm(false)
    setEditingProperty(null)
  }

  return (
    <div style={styles.page}>
      {/* ヘッダー */}
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>不動産管理アプリ</h1>
        <div style={styles.headerRight}>
          <span style={styles.userEmail}>{user?.email}</span>
          <button onClick={handleSignOut} style={styles.logoutButton}>
            ログアウト
          </button>
        </div>
      </header>

      <main style={styles.main}>
        {/* セクションヘッダー：タイトルと新規登録ボタン */}
        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>物件一覧</h2>
            <p style={styles.sectionSubtitle}>
              {fetchLoading ? '読み込み中...' : `${properties.length} 件の物件`}
            </p>
          </div>
          <button onClick={openCreateForm} style={styles.addButton}>
            ＋ 物件を登録
          </button>
        </div>

        {/* エラーメッセージ */}
        {error && <p style={styles.error}>{error}</p>}

        {/* 物件カードグリッド */}
        {fetchLoading ? (
          <p style={styles.loadingText}>データを読み込んでいます...</p>
        ) : properties.length === 0 ? (
          <div style={styles.empty}>
            <p style={styles.emptyText}>物件が登録されていません</p>
            <p style={styles.emptyHint}>「＋ 物件を登録」から最初の物件を追加してください</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onEdit={() => openEditForm(property)}
                onDelete={() => handleDelete(property)}
              />
            ))}
          </div>
        )}
      </main>

      {/* 登録・編集フォームモーダル */}
      {showForm && (
        <PropertyForm
          property={editingProperty}
          onSubmit={editingProperty ? handleUpdate : handleCreate}
          onCancel={closeForm}
          loading={formLoading}
        />
      )}
    </div>
  )
}

/**
 * PropertyCard: 物件情報を表示するカードコンポーネント
 * 編集ボタン・削除ボタンを持つ
 */
function PropertyCard({ property, onEdit, onDelete }) {
  return (
    <div style={styles.card}>
      {/* 物件画像プレースホルダー */}
      <div style={styles.imagePlaceholder}>
        <span style={styles.imagePlaceholderIcon}>🏠</span>
      </div>

      <div style={styles.cardBody}>
        <h3 style={styles.propertyName}>{property.name}</h3>

        {/* 家賃（月額） */}
        <p style={styles.rent}>
          ¥{property.rent.toLocaleString()}
          <span style={styles.rentUnit}> / 月</span>
        </p>

        {/* 物件詳細情報 */}
        <div style={styles.details}>
          <DetailRow label="エリア" value={property.area} />
          <DetailRow label="間取り" value={property.floor_plan} />
        </div>

        {/* 編集・削除ボタン */}
        <div style={styles.cardActions}>
          <button onClick={onEdit} style={styles.editButton}>
            編集
          </button>
          <button onClick={onDelete} style={styles.deleteButton}>
            削除
          </button>
        </div>
      </div>
    </div>
  )
}

function DetailRow({ label, value }) {
  return (
    <div style={styles.detailRow}>
      <span style={styles.detailLabel}>{label}</span>
      <span style={styles.detailValue}>{value}</span>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f0f4f8',
  },
  header: {
    backgroundColor: '#2d6a4f',
    color: '#fff',
    padding: '0 24px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  headerTitle: {
    fontSize: '18px',
    fontWeight: '700',
    margin: 0,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  userEmail: {
    fontSize: '14px',
    opacity: 0.85,
  },
  logoutButton: {
    padding: '6px 16px',
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.5)',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  main: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '32px 24px',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '4px',
  },
  sectionSubtitle: {
    fontSize: '14px',
    color: '#666',
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#2d6a4f',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  error: {
    backgroundColor: '#fff0f0',
    color: '#c0392b',
    border: '1px solid #f5c6c6',
    borderRadius: '6px',
    padding: '10px 14px',
    fontSize: '14px',
    marginBottom: '16px',
  },
  loadingText: {
    color: '#888',
    textAlign: 'center',
    padding: '48px 0',
  },
  empty: {
    textAlign: 'center',
    padding: '64px 0',
  },
  emptyText: {
    fontSize: '18px',
    color: '#555',
    marginBottom: '8px',
  },
  emptyHint: {
    fontSize: '14px',
    color: '#999',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  },
  imagePlaceholder: {
    height: '140px',
    backgroundColor: '#d8f3dc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderIcon: {
    fontSize: '48px',
  },
  cardBody: {
    padding: '16px',
  },
  propertyName: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '8px',
  },
  rent: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#2d6a4f',
    marginBottom: '12px',
  },
  rentUnit: {
    fontSize: '14px',
    fontWeight: '400',
    color: '#666',
  },
  details: {
    borderTop: '1px solid #eee',
    paddingTop: '12px',
    marginBottom: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
  },
  detailLabel: {
    color: '#888',
  },
  detailValue: {
    color: '#333',
    fontWeight: '500',
  },
  cardActions: {
    display: 'flex',
    gap: '8px',
  },
  editButton: {
    flex: 1,
    padding: '8px',
    backgroundColor: '#fff',
    color: '#2d6a4f',
    border: '1px solid #2d6a4f',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  deleteButton: {
    flex: 1,
    padding: '8px',
    backgroundColor: '#fff',
    color: '#c0392b',
    border: '1px solid #c0392b',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
  },
}
