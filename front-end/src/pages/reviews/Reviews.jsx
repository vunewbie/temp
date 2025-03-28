import React, { useState } from 'react';
import './Reviews.css';

const Reviews = () => {
  const [reviewForm, setReviewForm] = useState({
    name: '',
    email: '',
    rating: 5,
    comment: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReviewForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setReviewForm({
      name: '',
      email: '',
      rating: 5,
      comment: ''
    });
  };

  const reviews = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      rating: 5,
      date: '15/03/2024',
      comment: 'Món ăn rất ngon, không gian thoáng mát và nhân viên phục vụ rất nhiệt tình. Tôi sẽ quay lại vào lần sau!',
      avatar: 'placeholder'
    },
    {
      id: 2,
      name: 'Trần Thị B',
      rating: 4,
      date: '10/03/2024',
      comment: 'Thức ăn ngon, giá cả hợp lý. Tuy nhiên, thời gian chờ đợi hơi lâu vào giờ cao điểm.',
      avatar: 'placeholder'
    },
    {
      id: 3,
      name: 'Lê Văn C',
      rating: 5,
      date: '05/03/2024',
      comment: 'Đồ ăn tuyệt vời, đặc biệt là món Bò Lúc Lắc. Không gian nhà hàng rất đẹp và sang trọng.',
      avatar: 'placeholder'
    }
  ];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'star filled' : 'star'}>★</span>
      );
    }
    return stars;
  };

  return (
    <div className="reviews-container">
      <div className="reviews-header">
        <h1>Đánh Giá</h1>
        <p className="subtitle">Chia sẻ trải nghiệm của bạn tại Vunewbie Restaurant</p>
      </div>

      <div className="reviews-content">
        <div className="customer-reviews">
          <h2>Đánh Giá Từ Khách Hàng</h2>
          <div className="reviews-list">
            {reviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className={`review-avatar ${review.avatar}`}></div>
                  <div className="review-info">
                    <h3>{review.name}</h3>
                    <div className="review-rating">
                      {renderStars(review.rating)}
                    </div>
                    <p className="review-date">{review.date}</p>
                  </div>
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="review-form-container">
          <h2>Gửi Đánh Giá Của Bạn</h2>
          {isSubmitted ? (
            <div className="success-message">
              <h3>Cảm ơn bạn đã gửi đánh giá!</h3>
              <p>Đánh giá của bạn đã được ghi nhận và sẽ được hiển thị sau khi xét duyệt.</p>
              <button 
                className="new-review-button"
                onClick={() => setIsSubmitted(false)}
              >
                Gửi Đánh Giá Khác
              </button>
            </div>
          ) : (
            <form className="review-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Họ và Tên *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={reviewForm.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={reviewForm.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="rating">Đánh Giá *</label>
                <div className="rating-input">
                  {[5, 4, 3, 2, 1].map(star => (
                    <label key={star}>
                      <input
                        type="radio"
                        name="rating"
                        value={star}
                        checked={parseInt(reviewForm.rating) === star}
                        onChange={handleChange}
                      />
                      <span className="star">★</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="comment">Nhận Xét *</label>
                <textarea
                  id="comment"
                  name="comment"
                  value={reviewForm.comment}
                  onChange={handleChange}
                  rows="4"
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-button">Gửi Đánh Giá</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews; 