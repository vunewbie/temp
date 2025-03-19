import React from 'react';
import './Terms.css';

const MembershipPolicy = () => {
  return (
    <div className="terms-container">
      <div className="terms-content">
        <h1 className="terms-title">Chính Sách Thẻ Thành Viên</h1>
        <div className="terms-date">Cập nhật: 16/03/2025</div>
        
        <div className="terms-section membership-bronze">
          <h2 className="terms-section-title membership-title bronze">BRONZE</h2>
          
          <h3 className="terms-subsection-title">1. Quyền lợi</h3>
          <ul className="terms-list">
            <li>Đăng ký mở tài khoản miễn phí.</li>
            <li>Tham gia các chương trình khuyến mãi đổi thưởng.</li>
            <li>Tích lũy điểm không thời hạn cho đến khi đạt mức nâng hạng thẻ SILVER.</li>
          </ul>
          
          <h3 className="terms-subsection-title">2. Điều kiện</h3>
          <ul className="terms-list">
            <li>Khách hàng cung cấp đầy đủ thông tin cần thiết.</li>
            <li>Điều kiện NÂNG hạng thẻ SILVER: có tổng giá trị tiêu dùng tích lũy từ 10.000.000 VNĐ (100 điểm).</li>
          </ul>
        </div>
        
        <div className="terms-section membership-silver">
          <h2 className="terms-section-title membership-title silver">SILVER</h2>
          
          <h3 className="terms-subsection-title">1. Quyền lợi</h3>
          <ul className="terms-list">
            <li>Giảm 5% khi sử dụng dịch vụ trong hệ thống.</li>
          </ul>
          
          <h3 className="terms-subsection-title">2. Điều kiện</h3>
          <ul className="terms-list">
            <li>Điều kiện ĐẠT hạng thẻ SILVER: có tổng giá trị tiêu dùng tích lũy từ 10.000.000 VNĐ (100 điểm).</li>
            <li>Điều kiện GIỮ hạng thẻ SILVER: có tổng giá trị tiêu dùng tích lũy từ 5.000.000 VNĐ (50 điểm) trong vòng 01 năm kể từ ngày đạt thẻ SILVER.</li>
            <li>Điều kiện NÂNG hạng thẻ GOLD: có tổng giá trị tiêu dùng tích lũy từ 10.000.000 VNĐ (100 điểm) trong vòng 01 năm kể từ ngày đạt thẻ SILVER.</li>
            <li>Nếu trong vòng 01 năm kể từ ngày đạt thẻ SILVER có tổng giá trị tiêu dùng tích lũy dưới 5.000.000 VNĐ (50 điểm): thẻ sẽ trở lại mức ban đầu là BRONZE.</li>
          </ul>
        </div>
        
        <div className="terms-section membership-gold">
          <h2 className="terms-section-title membership-title gold">GOLD</h2>
          
          <h3 className="terms-subsection-title">1. Quyền lợi</h3>
          <ul className="terms-list">
            <li>Giảm 10% khi sử dụng dịch vụ trong hệ thống.</li>
            <li>Tham gia các chương trình khuyến mãi đổi thưởng.</li>
          </ul>
          
          <h3 className="terms-subsection-title">2. Điều kiện</h3>
          <ul className="terms-list">
            <li>Điều kiện ĐẠT hạng thẻ GOLD: có tổng giá trị tiêu dùng tích lũy từ 10.000.000 VNĐ (100 điểm) trong vòng 01 năm kể từ ngày đạt thẻ SILVER.</li>
            <li>Điều kiện GIỮ hạng thẻ GOLD: có tổng giá trị tiêu dùng tích lũy từ 10.000.000 VNĐ (100 điểm) trong vòng 01 năm kể từ ngày đạt thẻ GOLD.</li>
            <li>Nếu trong vòng 01 năm kể từ ngày đạt thẻ GOLD có tổng giá trị tiêu dùng tích lũy dưới 10.000.000 VNĐ (100 điểm): thẻ sẽ xuống hạng SILVER.</li>
          </ul>
        </div>
        
        <div className="terms-section">
          <h2 className="terms-section-title">ĐIỀU KHOẢN CHUNG</h2>
          <ul className="terms-list">
            <li>1 điểm tương ứng 100.000 VNĐ (giá trị sau cùng khách hàng thanh toán).</li>
            <li>Được áp dụng sử dụng dịch vụ tại nhà hàng và delivery trong toàn hệ thống.</li>
            <li>Được nâng hạng thành viên ngay tại thời điểm đủ điều kiện giá trị tiêu dùng tích lũy.</li>
          </ul>
          
          <h3 className="terms-subsection-title">Chương trình tri ân khách hàng:</h3>
          <p>
            Ngoài lợi ích được giảm giá khi trở thành thành viên hạng GOLD thì khách hàng còn có thể hưởng thêm ưu đãi đổi thưởng.
          </p>
          <p>
            Các chương trình khuyến mãi sẽ được áp dụng trên phạm vi từng thành phố trong toàn bộ chuỗi nhà hàng <span className="terms-highlight">Vunewbie</span>. 
            Khách hàng phải đạt hạng thành viên tối thiểu của một chương trình để hưởng ưu đãi. Số lượng sản phẩm tặng là có hạn cho mỗi chương trình. 
            Chương trình khuyến mãi có thể kết thúc kể cả khi số lượng sản phẩm tặng chưa hết do hết thời hạn. 
            Mỗi lần tham gia chương trình khuyến mãi khách hàng phải dùng điểm tích lũy để đổi. 
            Khách hàng sẽ cung cấp số điện thoại hoặc email đăng ký tài khoản cho nhân viên khi đổi quà.
          </p>
          <p>
            Đầu mỗi chu kỳ, tổng điểm tiêu dùng tích lũy trong năm sẽ trở về 0.
          </p>
          <p>
            Tổng điểm tiêu dùng tích lũy là số điểm khách hàng tích lũy được trong chu kỳ 1 năm. Ví dụ: Khách hàng đăng ký tài khoản 01/01/2023, 
            đến 31/12/2023 khách hàng tích lũy được 100 điểm trong cả năm thì tổng điểm = tổng điểm tiêu dùng tích lũy của khách hàng là 100. 
            Đến 01/01/2024, tổng điểm = 100 và tổng điểm tiêu dùng tích lũy = 0.
          </p>
        </div>
        
        <div className="terms-footer">
          <p>Nếu bạn có bất kỳ câu hỏi nào về Chính Sách Thành Viên này, vui lòng liên hệ với chúng tôi qua email: <a href="mailto:vulocninh1@gmail.com" className="terms-link">vulocninh1@gmail.com</a></p>
        </div>
      </div>
    </div>
  );
};

export default MembershipPolicy; 