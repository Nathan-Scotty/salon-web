import { useEffect, useState } from 'react';
import { products as productsApi } from '../lib/api';
import styles from '../styles/Store.module.css';

const WHATSAPP_NUMBER = '16137100754';
const ADMIN_EMAIL = 'davilasbarack@gmail.com';

function buildWhatsAppMessage(cart) {
  const lines = cart.map(item => `• ${item.name} x${item.qty} — $${(Number(item.price) * item.qty).toFixed(2)}`);
  const total = cart.reduce((s, i) => s + Number(i.price) * i.qty, 0);
  return encodeURIComponent(
    `Hello DHB Davilas! I would like to order the following products:\n\n${lines.join('\n')}\n\nTotal: $${total.toFixed(2)}\n\nCould you please confirm availability and arrange pickup/delivery?`
  );
}

export default function StorePage() {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [cart, setCart]               = useState([]);
  const [cartOpen, setCartOpen]       = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailInfo, setEmailInfo]     = useState({ name: '', email: '', phone: '' });
  const [sending, setSending]         = useState(false);
  const [sent, setSent]               = useState(false);

  useEffect(() => {
    productsApi.getAll(true)
      .then(setProductList).catch(console.error).finally(() => setLoading(false));
  }, []);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => {
      const updated = prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i);
      return updated.filter(i => i.qty > 0);
    });
  };

  const total = cart.reduce((s, i) => s + Number(i.price) * i.qty, 0);
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);

  const cartSummaryText = cart.map(i =>
    `${i.name} x${i.qty} — $${(Number(i.price) * i.qty).toFixed(2)}`
  ).join('\n');

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: emailInfo.name,
          email: emailInfo.email,
          phone: emailInfo.phone,
          message: `PRODUCT ORDER REQUEST\n\n${cartSummaryText}\n\nTotal: $${total.toFixed(2)}`,
        }),
      });
      setSent(true);
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Cart button */}
      {totalItems > 0 && (
        <button className={styles.cartBtn} onClick={() => setCartOpen(true)}>
          🛒 Cart
          <span className={styles.cartCount}>{totalItems}</span>
        </button>
      )}

      {/* Hero */}
      <div className={styles.hero}>
        <p className={styles.eyebrow}>DHB Davilas</p>
        <h1 className={styles.title}>Our Products</h1>
        <p className={styles.subtitle}>
          Premium hair care products handpicked by our stylists. Add to cart and contact us to arrange your order.
        </p>
        <div className={styles.divider}><span>✦</span></div>
      </div>

      {/* Product grid */}
      {loading && <p className={styles.loading}>Loading products...</p>}
      {!loading && productList.length === 0 && <p className={styles.empty}>No products available yet.</p>}
      {!loading && productList.length > 0 && (
        <div className={styles.grid}>
          {productList.map((p) => {
            const inCart = cart.find(i => i.id === p.id);
            const outOfStock = p.stock === 0;
            const lowStock = p.stock > 0 && p.stock <= 3;

            return (
              <div key={p.id} className={styles.card}>
                <div className={styles.imgWrap}>
                  {p.imageUrl
                    ? <img src={p.imageUrl} alt={p.name} className={styles.img} />
                    : <div className={styles.noImg}>🧴</div>
                  }
                  {outOfStock && <span className={styles.outOfStock}>Out of Stock</span>}
                  {lowStock && <span className={styles.lowStock}>Only {p.stock} left</span>}
                </div>
                <div className={styles.body}>
                  <h2 className={styles.name}>{p.name}</h2>
                  {p.description && <p className={styles.desc}>{p.description}</p>}
                  <div className={styles.footer}>
                    <span className={styles.price}>${Number(p.price).toFixed(2)}</span>
                    <span className={styles.stock}>{p.stock} in stock</span>
                  </div>
                  <button
                    className={`${styles.addBtn} ${inCart ? styles.added : ''}`}
                    onClick={() => !outOfStock && addToCart(p)}
                    disabled={outOfStock}
                  >
                    {outOfStock ? 'Out of Stock' : inCart ? `✓ In Cart (${inCart.qty})` : 'Add to Cart'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cart drawer */}
      {cartOpen && (
        <>
          <div className={styles.cartOverlay} onClick={() => setCartOpen(false)} />
          <div className={styles.cartDrawer}>
            <div className={styles.cartHeader}>
              <h2 className={styles.cartTitle}>Your Cart</h2>
              <button className={styles.cartClose} onClick={() => setCartOpen(false)}>×</button>
            </div>

            <div className={styles.cartItems}>
              {cart.length === 0 ? (
                <p className={styles.cartEmpty}>Your cart is empty.</p>
              ) : (
                cart.map(item => (
                  <div key={item.id} className={styles.cartItem}>
                    {item.imageUrl
                      ? <img src={item.imageUrl} alt={item.name} className={styles.cartItemImg} />
                      : <div className={styles.cartItemNoImg}>🧴</div>
                    }
                    <div className={styles.cartItemInfo}>
                      <p className={styles.cartItemName}>{item.name}</p>
                      <p className={styles.cartItemPrice}>${(Number(item.price) * item.qty).toFixed(2)}</p>
                    </div>
                    <div className={styles.cartItemQty}>
                      <button className={styles.qtyBtn} onClick={() => updateQty(item.id, -1)}>−</button>
                      <span className={styles.qtyNum}>{item.qty}</span>
                      <button className={styles.qtyBtn} onClick={() => updateQty(item.id, 1)}>+</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className={styles.cartFooter}>
                <div className={styles.cartTotal}>
                  <span>Total</span>
                  <span className={styles.cartTotalAmount}>${total.toFixed(2)}</span>
                </div>

                <div className={styles.checkoutBtns}>
                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage(cart)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.whatsappBtn}
                  >
                    <span>💬</span> Order via WhatsApp
                  </a>

                  {/* Email */}
                  <button
                    className={styles.emailBtn}
                    onClick={() => setShowEmailForm(!showEmailForm)}
                  >
                    ✉ Order via Email
                  </button>
                </div>

                {/* Email form */}
                {showEmailForm && (
                  <div className={styles.emailForm}>
                    {sent ? (
                      <p className={styles.successMsg}>✓ Order sent! We'll contact you shortly.</p>
                    ) : (
                      <form onSubmit={handleSendEmail}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                          <input className={styles.emailFormInput} type="text" placeholder="Your name" value={emailInfo.name} onChange={e => setEmailInfo({ ...emailInfo, name: e.target.value })} required />
                          <input className={styles.emailFormInput} type="email" placeholder="your@email.com" value={emailInfo.email} onChange={e => setEmailInfo({ ...emailInfo, email: e.target.value })} required />
                          <input className={styles.emailFormInput} type="tel" placeholder="+1 (000) 000-0000" value={emailInfo.phone} onChange={e => setEmailInfo({ ...emailInfo, phone: e.target.value })} />
                          <button className={styles.emailSendBtn} type="submit" disabled={sending}>
                            {sending ? 'Sending...' : 'Send Order'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                <p className={styles.cartNote}>
                  We will confirm your order and arrange pickup or delivery directly with you.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
