import { useState, useEffect } from 'react'

/**
 * PropertyForm: 物件の登録・編集に使う共通モーダルフォーム
 * - property が null のとき → 新規登録モード
 * - property にデータがあるとき → 編集モード
 */
export default function PropertyForm({ property, onSubmit, onCancel, loading }) {
  const [name, setName] = useState('')
  const [rent, setRent] = useState('')
  const [area, setArea] = useState('')
  const [floorPlan, setFloorPlan] = useState('')

  // 編集モードのとき既存値をフォームにセットする
  useEffect(() => {
    if (property) {
      setName(property.name)
      setRent(String(property.rent))
      setArea(property.area)
      setFloorPlan(property.floor_plan)
    } else {
      setName('')
      setRent('')
      setArea('')
      setFloorPlan('')
    }
  }, [property])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      name: name.trim(),
      rent: parseInt(rent, 10),
      area: area.trim(),
      floor_plan: floorPlan.trim(),
    })
  }

  const isEditMode = property !== null

  return (
    // モーダルの背景（クリックでキャンセル）
    <div style={styles.overlay} onClick={onCancel}>
      <div
        style={styles.modal}
        // モーダル内のクリックが背景に伝播しないよう止める
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={styles.title}>
          {isEditMode ? '物件を編集' : '物件を登録'}
        </h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <Field label="物件名" required>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: グランドヒルズ渋谷"
              required
              style={styles.input}
            />
          </Field>

          <Field label="家賃（円）" required>
            <input
              type="number"
              value={rent}
              onChange={(e) => setRent(e.target.value)}
              placeholder="例: 150000"
              min="0"
              required
              style={styles.input}
            />
          </Field>

          <Field label="エリア名" required>
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="例: 東京都渋谷区"
              required
              style={styles.input}
            />
          </Field>

          <Field label="間取り" required>
            <input
              type="text"
              value={floorPlan}
              onChange={(e) => setFloorPlan(e.target.value)}
              placeholder="例: 1LDK"
              required
              style={styles.input}
            />
          </Field>

          <div style={styles.actions}>
            <button
              type="button"
              onClick={onCancel}
              style={styles.cancelButton}
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ ...styles.submitButton, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? '保存中...' : isEditMode ? '更新する' : '登録する'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ラベル付きフィールドのレイアウトを共通化するヘルパーコンポーネント
function Field({ label, required, children }) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>
        {label}
        {required && <span style={styles.required}> *</span>}
      </label>
      {children}
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '32px',
    width: '100%',
    maxWidth: '460px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  },
  title: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  required: {
    color: '#e53e3e',
  },
  input: {
    padding: '10px 14px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '15px',
    outline: 'none',
    width: '100%',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '8px',
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#f5f5f5',
    color: '#333',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '10px 24px',
    backgroundColor: '#2d6a4f',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
}
