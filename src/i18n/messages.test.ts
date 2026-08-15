import { describe, expect, it } from 'vitest'
import { ca, dateLocale, en, t } from './messages'

describe('messages', () => {
  it('covers every English key in Catalan with a non-empty string', () => {
    const enKeys = Object.keys(en)
    expect(Object.keys(ca).sort()).toEqual([...enKeys].sort())
    for (const key of enKeys) {
      const typed = key as keyof typeof en
      expect(en[typed].length).toBeGreaterThan(0)
      expect(ca[typed].length).toBeGreaterThan(0)
    }
  })

  it('interpolates placeholders', () => {
    expect(t('en', 'statusMiss', { deg: 13 })).toBe('13° off the node')
    expect(t('ca', 'statusMiss', { deg: 13 })).toBe('13° del node')
    expect(t('en', 'tourStep', { n: 2, total: 4 })).toBe('2 / 4')
  })

  it('maps UI locales to date format tags', () => {
    expect(dateLocale('ca')).toBe('ca-ES')
    expect(dateLocale('en')).toBe('en-GB')
  })
})
