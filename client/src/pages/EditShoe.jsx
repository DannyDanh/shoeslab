import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ShoesAPI from '../services/ShoesAPI';
import { calcTotalPrice, formatPrice } from '../utilities/calcPrice';
import { validateShoeConfig, isValid, explainViolations } from '../utilities/validation';
import { sizes, brands, types, colors, cushions, cushionColors, laceColors, nameFrom, hexFrom, borderFrom } from '../utilities/options';
import ColorDot from '../components/ColorDot';

export default function EditShoe({ title = 'SHOES LAB | Edit' }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState(null);

  const nColor = nameFrom(colors);
  const nCClr  = nameFrom(cushionColors);
  const nLace  = nameFrom(laceColors);
  const hColor = hexFrom(colors);
  const bColor = borderFrom(colors);
  const hCushC = hexFrom(cushionColors);
  const bCushC = borderFrom(cushionColors);
  const hLace  = hexFrom(laceColors);
  const bLace  = borderFrom(laceColors);

  useEffect(() => { document.title = title; }, [title]);

  useEffect(() => {
    (async () => {
      try {
        const shoe = await ShoesAPI.getShoe(id);
        setForm(shoe);
      } catch (e) {
        setErr(e.message || 'Failed to load shoe');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  function onSelect(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: Number(value) }));
  }

  const violations = useMemo(() => validateShoeConfig(form), [form]);
  const okToSave   = useMemo(() => isValid(violations), [violations]);
  const total      = useMemo(() => calcTotalPrice(form), [form]);
  const totalLabel = useMemo(() => formatPrice(total), [total]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr(null);
    try {
      setSubmitting(true);
      const patch = {
        shoeName: form.shoeName,
        sizeId: form.sizeId,
        brandId: form.brandId,
        typeId: form.typeId,
        colorId: form.colorId,
        cushionId: form.cushionId,
        cushionColorId: form.cushionColorId,
        laceColorId: form.laceColorId,
      };
      await ShoesAPI.updateShoe(id, patch);
      navigate(`/customshoes/${id}`);
    } catch (e2) {
      setErr(e2.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading || !form) return <p style={{ padding: 16 }}>Loading…</p>;

  return (
    <div style={{ maxWidth: 720, margin: '24px auto', padding: 16 }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <h2 style={{ margin: 0 }}>Edit Shoe #{id}</h2>
        <div style={{ marginLeft: 'auto', fontWeight: 700 }}>Total: {totalLabel}</div>
      </header>

      {err && <p style={{ color: 'crimson' }}>{err}</p>}
      {violations.length > 0 && (
        <pre style={{ background: '#fff7ed', border: '1px solid #fed7aa', padding: 12, borderRadius: 8, whiteSpace: 'pre-wrap' }}>
          {explainViolations(violations)}
        </pre>
      )}

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 16 }}>
        <label>
          Shoe Name
          <input
            name="shoeName"
            value={form.shoeName || ''}
            onChange={(e) => setForm(prev => ({ ...prev, shoeName: e.target.value }))}
            required
          />
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 16 }}>
          <label>Size
            <select name="sizeId" value={form.sizeId ?? ''} onChange={onSelect}>
              {sizes.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>

          <label>Brand
            <select name="brandId" value={form.brandId ?? ''} onChange={onSelect}>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </label>

          <label>Type
            <select name="typeId" value={form.typeId ?? ''} onChange={onSelect}>
              {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </label>

          <label>Color
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ColorDot hex={hColor(form.colorId)} border={bColor(form.colorId)} title={nColor(form.colorId)} />
              <select name="colorId" value={form.colorId ?? ''} onChange={onSelect} style={{ flex: 1 }}>
                {colors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </label>

          <label>Cushion Type
            <select name="cushionId" value={form.cushionId ?? ''} onChange={onSelect}>
              {cushions.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>

          <label>Cushion Color
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ColorDot hex={hCushC(form.cushionColorId)} border={bCushC(form.cushionColorId)} title={nCClr(form.cushionColorId)} />
              <select name="cushionColorId" value={form.cushionColorId ?? ''} onChange={onSelect} style={{ flex: 1 }}>
                {cushionColors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </label>

          <label>Lace Color
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <ColorDot hex={hLace(form.laceColorId)} border={bLace(form.laceColorId)} title={nLace(form.laceColorId)} />
              <select name="laceColorId" value={form.laceColorId ?? ''} onChange={onSelect} style={{ flex: 1 }}>
                {laceColors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </label>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button type="submit" disabled={submitting || !okToSave}>
            {submitting ? 'Saving…' : 'Save Changes'}
          </button>
          <button type="button" onClick={() => navigate(`/customshoes/${id}`)}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
