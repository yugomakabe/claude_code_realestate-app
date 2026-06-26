import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

// 物件一覧のダミーデータ
const DUMMY_PROPERTIES = [
  { id: 1, name: 'グランドヒルズ渋谷', rent: 150000, area: '東京都渋谷区', type: '1LDK', size: '42.5㎡' },
  { id: 2, name: 'プレミアムコート新宿', rent: 120000, area: '東京都新宿区', type: '1K', size: '28.0㎡' },
  { id: 3, name: 'サニーパレス横浜', rent: 95000, area: '神奈川県横浜市', type: '2LDK', size: '58.2㎡' },
  { id: 4, name: 'エレガンス青山', rent: 200000, area: '東京都港区', type: '2LDK', size: '65.0㎡' },
  { id: 5, name: 'ガーデンコート大阪', rent: 85000, area: '大阪府大阪市北区', type: '1LDK', size: '38.0㎡' },
  { id: 6, name: 'リバーサイド品川', rent: 130000, area: '東京都品川区', type: '1LDK', size: '40.0㎡' },
]

/**
 * 物件一覧画面
 * ログイン済みユーザーのみアクセス可能（PrivateRoute で制御）
 * 現在はダミーデータを表示する（将来的には Supabase から取得する）
 */
export default function Properties() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    // ログアウト後はログイン画面に戻る
    navigate('/login')
  }

  return (
    <div style={styles.page}>
      {/* ヘッダー：アプリ名・ユーザー情報・ログアウトボタン */}
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
        <h2 style={styles.sectionTitle}>物件一覧</h2>
        <p style={styles.sectionSubtitle}>{DUMMY_PROPERTIES.length} 件の物件が見つかりました</p>

        {/* 物件カードグリッド */}
        <div style={styles.grid}>
          {DUMMY_PROPERTIES.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </main>
    </div>
  )
}

/**
 * 物件カードコンポーネント
 * 物件名・家賃・エリア・間取り・面積を表示する
 */
function PropertyCard({ property }) {
  return (
    <div style={styles.card}>
      {/* 物件画像プレースホルダー */}
      <div style={styles.imagePlaceholder}>
        <span style={styles.imagePlaceholderText}>🏠</span>
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
          <DetailRow label="間取り" value={property.type} />
          <DetailRow label="面積" value={property.size} />
        </div>

        <button style={styles.detailButton}>詳細を見る</button>
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
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '4px',
  },
  sectionSubtitle: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '24px',
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
    height: '160px',
    backgroundColor: '#d8f3dc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
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
  detailButton: {
    width: '100%',
    padding: '8px',
    backgroundColor: '#2d6a4f',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
  },
}
