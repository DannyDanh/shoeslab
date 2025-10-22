import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ShoesAPI from '../services/ShoesAPI';
import { calcTotalPrice, formatPrice } from '../utilities/calcPrice';
import { brands, types, colors, cushions, cushionColors, laceColors, toMap } from '../utilities/options';
import ColorDot from '../components/ColorDot';

export default function ViewShoes({ title = 'SHOES LAB | Custom Shoes' }) {
  const [shoes, setShoes] = useState([]);
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

  async function load() {
    try {
      setLoading(true);
      const data = await ShoesAPI.getAllShoes();
      setShoes(data);
    } catch (e) {
      setErr(e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  async function handleDelete(id) {
    if (!window.confirm(`Delete shoe #${id}?`)) return;
    try {
      await ShoesAPI.deleteShoe(id);
      await load();
    } catch (e) {
      alert(e.message || 'Delete failed');
    }
  }

  if (loading) return <p style={{ padding: 16 }}>Loading…</p>;
  if (err) return <p style={{ padding: 16, color: 'crimson' }}>{err}</p>;

  return (
    <div style={{ maxWidth: 1500, margin: '24px auto', padding: 16 }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <h2 style={{ margin: 0 }}>Custom Shoes</h2>
        <button onClick={() => navigate('/')} style={{ marginLeft: 'auto' }}>
          + Create New
        </button>
      </header>

      {shoes.length === 0 ? (
        <p style={{ marginTop: 16 }}>No shoes yet. Create one!</p>
      ) : (
        <div style={{ overflowX: 'hidden' }}>
          <table style={{ width: '100%', marginTop: 16, borderCollapse: 'collapse', minWidth: 1100 }}>
            <thead>
              <tr>
                <th align="left">ID</th>
                <th align="left">Name</th>
                <th align="left">Size</th>
                <th align="left">Brand</th>
                <th align="left">Type</th>
                <th align="left">Color</th>
                <th align="left">Cushion</th>
                <th align="left">Cushion Color</th>
                <th align="left">Lace Color</th>
                <th align="left">Price</th>
                <th align="left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shoes.map(s => {
                const price = calcTotalPrice(s);
                const c  = mColor[s.colorId];
                const cc = mCClr[s.cushionColorId];
                const lc = mLace[s.laceColorId];
                return (
                  <tr key={s.id} style={{ borderTop: '1px solid #eee' }}>
                    <td>#{s.id}</td>
                    <td><Link to={`/customshoes/${s.id}`}>{s.shoeName}</Link></td>
                    <td>{s.sizeId}</td>
                    <td>{mBrand[s.brandId]?.name ?? s.brandId}</td>
                    <td>{mType[s.typeId]?.name ?? s.typeId}</td>
                    <td>
                      <ColorDot hex={c?.hex} border={c?.border} title={c?.name} />
                      {c?.name ?? s.colorId}
                    </td>
                    <td>{mCush[s.cushionId]?.name ?? s.cushionId}</td>
                    <td>
                      <ColorDot hex={cc?.hex} border={cc?.border} title={cc?.name} />
                      {cc?.name ?? s.cushionColorId}
                    </td>
                    <td>
                      <ColorDot hex={lc?.hex} border={lc?.border} title={lc?.name} />
                      {lc?.name ?? s.laceColorId}
                    </td>
                    <td style={{ fontWeight: 700 }}>{formatPrice(price)}</td>
                    <td>
                      <button onClick={() => navigate(`/edit/${s.id}`)}>Edit</button>
                      <button onClick={() => handleDelete(s.id)} style={{ marginLeft: 8, color: 'crimson' }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
