import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, Phone, Clock, Instagram, Facebook, ChevronRight, 
  UtensilsCrossed, Star, Heart, ShoppingCart, X, Plus, Minus, 
  Settings, Image as ImageIcon, Edit3, Trash2, CheckCircle2
} from 'lucide-react';

// --- Types ---
interface MenuItem {
  id: number;
  name: string;
  price: number;
  desc: string;
  image: string;
  category: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface Review {
  id: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
  avatar: string;
}

// --- Mock Data ---
const INITIAL_MENU: MenuItem[] = [
  { id: 1, name: "Bánh tráng kẹp", price: 15000, desc: "Giòn tan, đậm đà vị bò khô và trứng.", image: "https://picsum.photos/seed/banh-trang/400/300", category: "Bánh tráng" },
  { id: 2, name: "Chân gà sả tắc", price: 35000, desc: "Chua cay mặn ngọt, giòn sần sật.", image: "https://picsum.photos/seed/chan-ga/400/300", category: "Đồ chiên" },
  { id: 3, name: "Ốc hút nước dừa", price: 45000, desc: "Vị béo ngậy của cốt dừa hòa quyện vị cay.", image: "https://picsum.photos/seed/oc-hut/400/300", category: "Đồ chiên" },
  { id: 4, name: "Trà sữa nhà làm", price: 20000, desc: "Trà đậm vị, sữa béo vừa phải, trân châu dai.", image: "https://picsum.photos/seed/milktea/400/300", category: "Nước uống" },
  { id: 5, name: "Gỏi khô bò", price: 25000, desc: "Đu đủ giòn, bò khô cay nồng, nước gỏi đặc biệt.", image: "https://picsum.photos/seed/goi-bo/400/300", category: "Bánh tráng" },
  { id: 6, name: "Nem chua rán", price: 30000, desc: "Vỏ giòn rụm, nhân mềm thơm nóng hổi.", image: "https://picsum.photos/seed/nem-chua/400/300", category: "Đồ chiên" },
];

const INITIAL_REVIEWS: Review[] = [
  { id: 1, user: "Nguyễn Văn An", rating: 5, comment: "Bánh tráng kẹp ở đây là đỉnh nhất Đà Nẵng luôn, giòn và thơm cực kỳ!", date: "2 ngày trước", avatar: "https://picsum.photos/seed/user1/100/100" },
  { id: 2, user: "Trần Thị Bình", rating: 4, comment: "Ốc hút rất thấm vị, nước dừa béo ngậy. Sẽ quay lại ủng hộ cô Tiên.", date: "1 tuần trước", avatar: "https://picsum.photos/seed/user2/100/100" },
  { id: 3, user: "Lê Hoàng Long", rating: 5, comment: "Giao hàng nhanh, đồ ăn vẫn còn nóng hổi. Rất hài lòng với dịch vụ.", date: "3 ngày trước", avatar: "https://picsum.photos/seed/user3/100/100" },
];

// --- Components ---

const CartPopup = ({ isOpen, onClose, cart, updateQuantity, removeFromCart }: any) => {
  const total = cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-serif font-bold flex items-center gap-2">
                <ShoppingCart className="text-brand-orange" /> Giỏ hàng của bạn
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="text-center py-20">
                  <div className="bg-stone-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart size={32} className="text-stone-400" />
                  </div>
                  <p className="text-stone-500">Giỏ hàng đang trống...</p>
                </div>
              ) : (
                cart.map((item: any) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <img src={item.image} className="w-20 h-20 rounded-xl object-cover" alt={item.name} referrerPolicy="no-referrer" />
                    <div className="flex-1">
                      <h4 className="font-bold">{item.name}</h4>
                      <p className="text-brand-orange font-semibold">{item.price.toLocaleString()}đ</p>
                      <div className="flex items-center gap-3 mt-2">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 rounded-lg border border-stone-200 flex items-center justify-center hover:bg-stone-50"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 rounded-lg border border-stone-200 flex items-center justify-center hover:bg-stone-50"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-stone-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t bg-stone-50">
              <div className="flex justify-between items-center mb-6">
                <span className="text-stone-500 font-medium">Tổng cộng:</span>
                <span className="text-2xl font-serif font-bold text-brand-orange">{total.toLocaleString()}đ</span>
              </div>
              <button className="w-full bg-brand-dark text-white py-4 rounded-xl font-bold hover:bg-stone-800 transition-all shadow-lg">
                Thanh toán ngay
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Navbar = ({ cartCount, onOpenCart, isAdmin, onToggleAdmin }: any) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-cream/80 backdrop-blur-md border-b border-brand-dark/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-4">
            <span className="text-2xl font-serif font-bold text-brand-orange italic">Đặc sản cô Tiên</span>
            <button 
              onClick={onToggleAdmin}
              className={`p-2 rounded-full transition-all ${isAdmin ? 'bg-brand-orange text-white' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}
              title="Chế độ quản lý"
            >
              <Settings size={18} />
            </button>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#home" className="nav-link">Trang chủ</a>
            <a href="#menu" className="nav-link">Thực đơn</a>
            <a href="#reviews" className="nav-link">Đánh giá</a>
            <a href="#about" className="nav-link">Về chúng tôi</a>
            <a href="#contact" className="nav-link">Liên hệ</a>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onOpenCart}
              className="relative p-2.5 bg-white rounded-full shadow-sm border border-stone-100 hover:shadow-md transition-all"
            >
              <ShoppingCart size={22} className="text-brand-dark" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="hidden sm:block bg-brand-orange text-white px-6 py-2.5 rounded-full font-medium hover:bg-orange-600 transition-all shadow-lg shadow-orange-200">
              Đặt món ngay
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  return (
    <section id="home" className="relative pt-32 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-4 rounded-full bg-orange-100 text-brand-orange text-sm font-semibold mb-6">
              ✨ Tinh hoa ẩm thực Đà Thành
            </span>
            <h1 className="text-6xl md:text-7xl font-serif font-bold leading-[1.1] mb-6">
              Đặc sản <span className="italic text-brand-orange">Cô Tiên</span> - Vị ngon khó cưỡng
            </h1>
            <p className="text-lg text-stone-600 mb-8 max-w-lg leading-relaxed">
              Khám phá thế giới đặc sản đầy màu sắc tại Đặc sản cô Tiên. Từ những món truyền thống đến những sáng tạo mới lạ, chúng tôi mang đến niềm vui trong từng miếng cắn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#menu" className="bg-brand-dark text-white px-8 py-4 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-stone-800 transition-all">
                Xem thực đơn <ChevronRight size={20} />
              </a>
              <button className="border border-brand-dark/20 px-8 py-4 rounded-full font-medium hover:bg-white transition-all">
                Tìm hiểu thêm
              </button>
            </div>
            
            <div className="mt-12 flex items-center gap-8">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img 
                    key={i}
                    src={`https://picsum.photos/seed/user${i}/100/100`} 
                    className="w-12 h-12 rounded-full border-4 border-brand-cream object-cover"
                    alt="User"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
              <div>
                <div className="flex text-brand-orange">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-sm text-stone-500 font-medium">Hơn 1000+ khách hàng tin tưởng</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 rounded-[40px] overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://picsum.photos/seed/food-hero/800/1000" 
                alt="Món đặc sản hấp dẫn" 
                className="w-full h-auto object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-orange-200 rounded-full blur-3xl opacity-50 -z-10"></div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-yellow-100 rounded-full blur-3xl opacity-50 -z-10"></div>
            
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl z-20 max-w-[200px]"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-orange-100 p-2 rounded-lg text-brand-orange">
                  <Heart size={20} fill="currentColor" />
                </div>
                <span className="font-bold text-lg">98%</span>
              </div>
              <p className="text-xs text-stone-500">Khách hàng quay lại lần thứ hai</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const MenuSection = ({ menu, addToCart, isAdmin, onUpdateItem, onAddItem, onDeleteItem }: any) => {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const categories = ["Tất cả", "Bánh tráng", "Đồ chiên", "Nước uống"];
  
  const filteredMenu = activeCategory === "Tất cả" 
    ? menu 
    : menu.filter((item: MenuItem) => item.category === activeCategory);

  return (
    <section id="menu" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="text-left">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">Thực đơn đặc sắc</h2>
            <p className="text-stone-500 max-w-2xl">Từng món ăn đều được cô Tiên chăm chút tỉ mỉ từ khâu chọn nguyên liệu đến chế biến để mang lại hương vị đúng chuẩn nhất.</p>
          </div>
          {isAdmin && (
            <button 
              onClick={onAddItem}
              className="bg-brand-orange text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-600 transition-all"
            >
              <Plus size={20} /> Thêm món mới
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap justify-start gap-4 mb-12">
          {categories.map((cat, i) => (
            <button 
              key={i} 
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat ? 'bg-brand-orange text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredMenu.map((item: MenuItem) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -10 }}
                className="group bg-brand-cream rounded-3xl overflow-hidden border border-stone-100 transition-all hover:shadow-xl relative"
              >
                <div className="h-64 overflow-hidden relative">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-brand-orange font-bold">
                    {item.price.toLocaleString()}đ
                  </div>
                  {isAdmin && (
                    <div className="absolute top-4 left-4 flex gap-2">
                      <button 
                        onClick={() => onUpdateItem(item)}
                        className="bg-white/90 p-2 rounded-full text-blue-500 hover:bg-blue-500 hover:text-white transition-all"
                      >
                        <ImageIcon size={18} />
                      </button>
                      <button 
                        onClick={() => onDeleteItem(item.id)}
                        className="bg-white/90 p-2 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold group-hover:text-brand-orange transition-colors">{item.name}</h3>
                    {isAdmin && (
                      <button onClick={() => onUpdateItem(item)} className="text-stone-400 hover:text-brand-orange">
                        <Edit3 size={16} />
                      </button>
                    )}
                  </div>
                  <p className="text-stone-500 text-sm mb-4 h-10 overflow-hidden line-clamp-2">{item.desc}</p>
                  <button 
                    onClick={() => addToCart(item)}
                    className="w-full py-3 rounded-xl border border-brand-orange text-brand-orange font-semibold hover:bg-brand-orange hover:text-white transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={18} /> Thêm vào giỏ hàng
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const ReviewsSection = ({ reviews }: { reviews: Review[] }) => {
  return (
    <section id="reviews" className="py-24 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">Khách hàng nói gì?</h2>
          <p className="text-stone-500">Sự hài lòng của bạn là động lực lớn nhất để cô Tiên tiếp tục hành trình ẩm thực.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-8 rounded-[32px] shadow-sm border border-stone-100">
              <div className="flex items-center gap-4 mb-6">
                <img src={review.avatar} className="w-12 h-12 rounded-full object-cover" alt={review.user} referrerPolicy="no-referrer" />
                <div>
                  <h4 className="font-bold">{review.user}</h4>
                  <p className="text-xs text-stone-400">{review.date}</p>
                </div>
              </div>
              <div className="flex text-brand-orange mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < review.rating ? "currentColor" : "none"} />
                ))}
              </div>
              <p className="text-stone-600 italic leading-relaxed">"{review.comment}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <img src="https://picsum.photos/seed/about1/400/600" className="rounded-3xl shadow-lg" alt="About" referrerPolicy="no-referrer" />
                <img src="https://picsum.photos/seed/about2/400/400" className="rounded-3xl shadow-lg" alt="About" referrerPolicy="no-referrer" />
              </div>
              <div className="space-y-4">
                <img src="https://picsum.photos/seed/about3/400/400" className="rounded-3xl shadow-lg" alt="About" referrerPolicy="no-referrer" />
                <img src="https://picsum.photos/seed/about4/400/600" className="rounded-3xl shadow-lg" alt="About" referrerPolicy="no-referrer" />
              </div>
            </div>
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-orange-100 rounded-full blur-3xl opacity-30"></div>
          </div>
          
          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 italic">Câu chuyện của <span className="text-brand-orange">Cô Tiên</span></h2>
            <div className="space-y-6 text-stone-600 leading-relaxed">
              <p>
                Bắt đầu từ một gánh hàng nhỏ ven đường Đống Đa, Đặc sản cô Tiên đã trở thành điểm đến quen thuộc của biết bao thế hệ học sinh, sinh viên và người dân Đà Nẵng. 
              </p>
              <p>
                Với tâm niệm "Nấu cho khách như nấu cho người thân", cô Tiên luôn tỉ mỉ trong từng công đoạn. Không chỉ là đồ ăn, đó là cả một bầu trời kỷ niệm và sự chân thành của người con miền Trung.
              </p>
              <div className="grid grid-cols-2 gap-8 py-6">
                <div>
                  <div className="text-3xl font-serif font-bold text-brand-orange mb-1">10+</div>
                  <div className="text-sm font-medium text-stone-500 uppercase tracking-wider">Năm kinh nghiệm</div>
                </div>
                <div>
                  <div className="text-3xl font-serif font-bold text-brand-orange mb-1">50+</div>
                  <div className="text-sm font-medium text-stone-500 uppercase tracking-wider">Món ăn đa dạng</div>
                </div>
              </div>
              <button className="bg-brand-dark text-white px-8 py-4 rounded-full font-medium hover:bg-stone-800 transition-all">
                Khám phá thêm
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-dark rounded-[48px] p-8 md:p-16 text-white relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8">Ghé thăm chúng mình</h2>
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 rounded-2xl">
                    <MapPin className="text-brand-orange" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Địa chỉ</h4>
                    <p className="text-stone-400">K334/20 Đống Đa, phường Hải Châu, thành phố Đà Nẵng</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 rounded-2xl">
                    <Phone className="text-brand-orange" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Số điện thoại</h4>
                    <p className="text-stone-400">0905 123 456</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 rounded-2xl">
                    <Clock className="text-brand-orange" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Giờ mở cửa</h4>
                    <p className="text-stone-400">14:00 - 22:00 (Hàng ngày)</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 flex gap-4">
                <a href="#" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-orange transition-all">
                  <Facebook size={20} />
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-orange transition-all">
                  <Instagram size={20} />
                </a>
              </div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <h3 className="text-2xl font-serif font-bold mb-6">Gửi tin nhắn cho cô Tiên</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Họ tên" className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-orange transition-all" />
                  <input type="text" placeholder="Số điện thoại" className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-orange transition-all" />
                </div>
                <input type="email" placeholder="Email" className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-orange transition-all" />
                <textarea placeholder="Lời nhắn của bạn..." rows={4} className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-orange transition-all"></textarea>
                <button className="w-full bg-brand-orange text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition-all">
                  Gửi yêu cầu
                </button>
              </form>
            </div>
          </div>
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/20 rounded-full blur-[120px] -z-0"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] -z-0"></div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-12 border-t border-stone-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-2xl font-serif font-bold text-brand-orange italic">Đặc sản cô Tiên</div>
          <div className="flex gap-8 text-sm text-stone-500 font-medium">
            <a href="#" className="hover:text-brand-orange transition-colors">Chính sách bảo mật</a>
            <a href="#" className="hover:text-brand-orange transition-colors">Điều khoản dịch vụ</a>
            <a href="#" className="hover:text-brand-orange transition-colors">Giao hàng</a>
          </div>
          <div className="text-sm text-stone-400">
            © 2024 Đặc sản cô Tiên. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main Page ---

export const LandingPage = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Fetch data on mount
  useEffect(() => {
    fetchMenu();
    fetchReviews();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      setMenu(data);
    } catch (err) {
      console.error("Lỗi tải thực đơn:", err);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error("Lỗi tải đánh giá:", err);
    }
  };

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    showNotification(`Đã thêm ${item.name} vào giỏ hàng!`);
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Admin Actions (Real Persistence)
  const handleAddItem = async () => {
    const newItem = {
      name: "Món mới cập nhật",
      price: 20000,
      desc: "Mô tả món ăn mới vừa được thêm vào thực đơn.",
      image: `https://picsum.photos/seed/${Date.now()}/400/300`,
      category: "Đồ chiên"
    };

    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      if (res.ok) {
        fetchMenu();
        showNotification("Đã thêm món mới thành công!");
      }
    } catch (err) {
      showNotification("Lỗi khi thêm món!");
    }
  };

  const handleUpdateItem = async (item: MenuItem) => {
    const newName = prompt("Nhập tên mới cho món ăn:", item.name);
    if (newName) {
      try {
        const res = await fetch(`/api/menu/${item.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newName })
        });
        if (res.ok) {
          fetchMenu();
          showNotification("Đã cập nhật thông tin món ăn!");
        }
      } catch (err) {
        showNotification("Lỗi khi cập nhật!");
      }
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (confirm("Bạn có chắc muốn xóa món này khỏi thực đơn?")) {
      try {
        const res = await fetch(`/api/menu/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchMenu();
          showNotification("Đã xóa món ăn!");
        }
      } catch (err) {
        showNotification("Lỗi khi xóa món!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream selection:bg-brand-orange/20">
      <Navbar 
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)} 
        onOpenCart={() => setIsCartOpen(true)}
        isAdmin={isAdmin}
        onToggleAdmin={() => setIsAdmin(!isAdmin)}
      />
      
      <main>
        <Hero />
        <MenuSection 
          menu={menu} 
          addToCart={addToCart} 
          isAdmin={isAdmin}
          onAddItem={handleAddItem}
          onUpdateItem={handleUpdateItem}
          onDeleteItem={handleDeleteItem}
        />
        <ReviewsSection reviews={reviews} />
        <AboutSection />
        <ContactSection />
      </main>
      
      <Footer />

      <CartPopup 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
      />

      {/* Admin Indicator */}
      {isAdmin && (
        <div className="fixed bottom-8 left-8 bg-brand-dark text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-2xl z-50 border border-white/10">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          CHẾ ĐỘ QUẢN TRỊ VIÊN
        </div>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 bg-white border border-stone-100 shadow-2xl p-4 rounded-2xl z-[100] flex items-center gap-3"
          >
            <div className="bg-green-100 p-2 rounded-full text-green-600">
              <CheckCircle2 size={20} />
            </div>
            <span className="font-medium text-stone-700">{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
