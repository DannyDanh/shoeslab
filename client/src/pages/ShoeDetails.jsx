import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ShoesAPI from '../services/ShoesAPI';
import { calcTotalPrice, formatPrice } from '../utilities/calcPrice';
import { brands, types, colors, cushions, cushionColors, laceColors, toMap } from '../utilities/options';
import ColorDot from '../components/ColorDot';

function Field({ label, value, swatch }) {
  return (
    <div style={{ padding: 8, border: '1px solid #eee', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ minWidth: 120, fontSize: 12, color: '#666' }}>{label}</div>
      {swatch}
      <div style={{ fontWeight: 600 }}>{String(value)}</div>
    </div>
  );
}

export default function ShoeDetails({ title = 'SHOES LAB | View' }) {
  const { id } = useParams();
  const [shoe, setShoe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();
  useEffect(() => { document.title = title; }, [title]);

  const mBrand = useMemo(() => toMap(brands), []);
  const mType = useMemo(() => toMap(types), []);
  const mColor = useMemo(() => toMap(colors), []);
  const mCush = useMemo(() => toMap(cushions), []);
  const mCClr = useMemo(() => toMap(cushionColors), []);
  const mLace = useMemo(() => toMap(laceColors), []);

  useEffect(() => {
    (async () => {
      try {
        const data = await ShoesAPI.getShoe(id);
        setShoe(data);
      } catch (e) {
        setErr(e.message || 'Failed to load shoe');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function handleDelete() {
    if (!window.confirm(`Delete shoe #${id}?`)) return;
    try {
      await ShoesAPI.deleteShoe(id);
      navigate('/customshoes');
    } catch (e) {
      alert(e.message || 'Delete failed');
    }
  }

  if (loading) return <p style={{ padding: 16 }}>Loading…</p>;
  if (err) return <p style={{ padding: 16, color: 'crimson' }}>{err}</p>;
  if (!shoe) return <p style={{ padding: 16 }}>Not found.</p>;

  const total = calcTotalPrice(shoe);
  const totalLabel = formatPrice(total);

  const c  = mColor[shoe.colorId];
  const cc = mCClr[shoe.cushionColorId];
  const lc = mLace[shoe.laceColorId];

  return (
    <div style={{ maxWidth: 760, margin: '24px auto', padding: 16 }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <h2 style={{ margin: 0 }}>Shoe #{shoe.id}</h2>
        <div style={{ marginLeft: 'auto', fontWeight: 700 }}>Total: {totalLabel}</div>
        <button onClick={() => navigate(`/edit/${shoe.id}`)} style={{ marginLeft: 8 }}>Edit</button>
        <button onClick={handleDelete} style={{ color: 'crimson', marginLeft: 8 }}>Delete</button>
      </header>

      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
        <Field label="Name" value={shoe.shoeName} />
        <Field label="Size" value={shoe.sizeId} />
        <Field label="Brand" value={mBrand[shoe.brandId]?.name ?? shoe.brandId} />
        <Field label="Type" value={mType[shoe.typeId]?.name ?? shoe.typeId} />
        <Field
          label="Color"
          value={c?.name ?? shoe.colorId}
          swatch={<ColorDot hex={c?.hex} border={c?.border} title={c?.name} />}
        />
        <Field label="Cushion" value={mCush[shoe.cushionId]?.name ?? shoe.cushionId} />
        <Field
          label="Cushion Color"
          value={cc?.name ?? shoe.cushionColorId}
          swatch={<ColorDot hex={cc?.hex} border={cc?.border} title={cc?.name} />}
        />
        <Field
          label="Lace Color"
          value={lc?.name ?? shoe.laceColorId}
          swatch={<ColorDot hex={lc?.hex} border={lc?.border} title={lc?.name} />}
        />
      </div>

      <p style={{ marginTop: 16 }}>
        <Link to="/customshoes">← Back to list</Link>
      </p>
    </div>
  );
}
