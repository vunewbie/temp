import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <div className="about-header-content">
          <h1 className="about-title">Về Chúng Tôi</h1>
          <p className="about-subtitle">Khám phá câu chuyện, tầm nhìn và những giá trị cốt lõi của Vunewbie</p>
        </div>
        <div className="scroll-indicator"></div>
      </div>

      <div className="about-video-section">
        <div className="about-section-title-container">
          <h2 className="about-section-title">Khám Phá Vunewbie</h2>
          <div className="about-section-underline"></div>
        </div>
        <div className="about-video-container">
          <iframe 
            className="about-video"
            src="https://www.youtube.com/embed/cEG4qaNY6qQ" 
            title="Khám Phá Vunewbie" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <div className="about-content">
        <section className="about-section">
          <div className="about-section-title-container">
            <h2 className="about-section-title">Lịch Sử Hình Thành</h2>
            <div className="about-section-underline"></div>
          </div>
          <div className="about-section-content">
            <div className="about-section-image history-image"></div>
            <div className="about-section-text">
              <p>Vunewbie được thành lập vào năm 2015 bởi đầu bếp Nguyễn Hoàng Vũ với một nhà hàng nhỏ tại Lộc Ninh, Bình Phước. Xuất phát từ niềm đam mê ẩm thực và mong muốn mang đến những trải nghiệm ẩm thực độc đáo, Vunewbie đã dần phát triển từ một nhà hàng nhỏ thành một thương hiệu ẩm thực được yêu thích trên toàn quốc.</p>
              
              <p>Trong những năm đầu, Vunewbie tập trung vào việc hoàn thiện các công thức nấu ăn truyền thống, kết hợp với những kỹ thuật hiện đại để tạo ra những món ăn độc đáo mang đậm bản sắc Việt Nam. Đến năm 2018, Vunewbie đã mở rộng với chi nhánh đầu tiên tại Thành phố Hồ Chí Minh, đánh dấu bước ngoặt quan trọng trong hành trình phát triển.</p>
              
              <p>Năm 2020, mặc dù đối mặt với nhiều thách thức do đại dịch COVID-19, Vunewbie đã nhanh chóng thích nghi bằng cách phát triển dịch vụ giao hàng và các giải pháp ẩm thực tại nhà. Đây cũng là thời điểm chúng tôi đầu tư mạnh mẽ vào công nghệ, xây dựng nền tảng đặt hàng trực tuyến và hệ thống quản lý khách hàng hiện đại.</p>
              
              <p>Đến năm 2023, Vunewbie đã có mặt tại 3 thành phố lớn với hơn 15 chi nhánh, phục vụ hàng nghìn thực khách mỗi ngày. Chúng tôi tự hào về hành trình phát triển của mình và cam kết tiếp tục đổi mới, sáng tạo để mang đến những trải nghiệm ẩm thực tuyệt vời nhất cho khách hàng.</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="about-section-title-container">
            <h2 className="about-section-title">Tầm Nhìn & Sứ Mệnh</h2>
            <div className="about-section-underline"></div>
          </div>
          <div className="about-section-content reverse">
            <div className="about-section-image vision-image"></div>
            <div className="about-section-text">
              <h3 className="about-subsection-title">Tầm Nhìn</h3>
              <p>Vunewbie hướng đến việc trở thành thương hiệu ẩm thực hàng đầu Việt Nam, được công nhận không chỉ bởi chất lượng món ăn mà còn bởi trải nghiệm dịch vụ xuất sắc và những giá trị bền vững mà chúng tôi mang lại cho cộng đồng.</p>
              
              <p>Chúng tôi mong muốn xây dựng một hệ thống nhà hàng trên toàn quốc, nơi mỗi chi nhánh không chỉ là điểm đến ẩm thực mà còn là không gian văn hóa, nơi mọi người có thể kết nối, chia sẻ và tận hưởng những khoảnh khắc đáng nhớ bên bạn bè và gia đình.</p>
              
              <h3 className="about-subsection-title">Sứ Mệnh</h3>
              <p>Sứ mệnh của Vunewbie là mang đến trải nghiệm ẩm thực đẳng cấp, kết hợp giữa hương vị truyền thống và sự sáng tạo hiện đại, trong một không gian thân thiện và dịch vụ chuyên nghiệp.</p>
              
              <p>Chúng tôi cam kết:</p>
              <ul className="about-list">
                <li>Sử dụng nguyên liệu tươi ngon, chất lượng cao và có nguồn gốc rõ ràng</li>
                <li>Không ngừng đổi mới và sáng tạo trong thực đơn và cách phục vụ</li>
                <li>Xây dựng môi trường làm việc tích cực, nơi mỗi nhân viên đều được tôn trọng và có cơ hội phát triển</li>
                <li>Đóng góp tích cực cho cộng đồng thông qua các hoạt động trách nhiệm xã hội</li>
                <li>Áp dụng các biện pháp bảo vệ môi trường trong hoạt động kinh doanh</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="about-section-title-container">
            <h2 className="about-section-title">Giá Trị Cốt Lõi</h2>
            <div className="about-section-underline"></div>
          </div>
          <div className="about-values">
            <div className="about-value-card">
              <div className="about-value-icon quality-icon"></div>
              <h3 className="about-value-title">Chất Lượng</h3>
              <p className="about-value-description">Chúng tôi không ngừng nỗ lực để đảm bảo chất lượng cao nhất trong mọi khía cạnh, từ nguyên liệu đến dịch vụ. Mỗi món ăn đều được chuẩn bị cẩn thận và kiểm soát nghiêm ngặt trước khi đến tay khách hàng.</p>
            </div>
            <div className="about-value-card">
              <div className="about-value-icon innovation-icon"></div>
              <h3 className="about-value-title">Sáng Tạo</h3>
              <p className="about-value-description">Sự sáng tạo là động lực giúp chúng tôi không ngừng phát triển. Chúng tôi luôn tìm kiếm những ý tưởng mới, kết hợp giữa truyền thống và hiện đại để tạo ra những trải nghiệm ẩm thực độc đáo.</p>
            </div>
            <div className="about-value-card">
              <div className="about-value-icon integrity-icon"></div>
              <h3 className="about-value-title">Chính Trực</h3>
              <p className="about-value-description">Chúng tôi hoạt động với sự minh bạch và trung thực trong mọi giao dịch. Từ việc lựa chọn nhà cung cấp đến cách đối xử với nhân viên và khách hàng, chính trực là giá trị không thể thiếu.</p>
            </div>
            <div className="about-value-card">
              <div className="about-value-icon community-icon"></div>
              <h3 className="about-value-title">Cộng Đồng</h3>
              <p className="about-value-description">Chúng tôi tin rằng thành công của Vunewbie gắn liền với sự phát triển của cộng đồng. Vì vậy, chúng tôi tích cực tham gia các hoạt động xã hội và hỗ trợ các dự án phát triển địa phương.</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <div className="about-section-title-container">
            <h2 className="about-section-title">Các Cổ Đông</h2>
            <div className="about-section-underline"></div>
          </div>
          <div className="about-team">
            <div className="about-team-intro">
              <p>Đội ngũ Vunewbie là sự kết hợp hoàn hảo giữa những đầu bếp tài năng, nhân viên phục vụ tận tâm và đội ngũ quản lý giàu kinh nghiệm. Chúng tôi tự hào về văn hóa làm việc đề cao sự tôn trọng, hợp tác và không ngừng học hỏi.</p>
              <p>Mỗi thành viên trong đội ngũ Vunewbie đều được đào tạo chuyên sâu và thường xuyên cập nhật những xu hướng mới nhất trong ngành ẩm thực. Chúng tôi tin rằng, chính sự đam mê và chuyên nghiệp của đội ngũ là yếu tố quan trọng tạo nên trải nghiệm đáng nhớ cho khách hàng.</p>
            </div>
            <div className="about-team-members">
              <div className="about-team-member">
                <div className="about-team-member-image chef"></div>
                <h3 className="about-team-member-name">Gordon Ramsay</h3>
                <p className="about-team-member-position">Bếp Trưởng & Co-Founder</p>
                <p className="about-team-member-description">Gordon Ramsay là một đầu bếp người Anh, người được biết đến với khả năng sáng tạo và độc đáo trong công việc nấu ăn. Ông đã từng làm việc tại nhiều nhà hàng nổi tiếng trên thế giới và được đánh giá là một trong những đầu bếp hàng đầu trên thế giới.</p>
              </div>
              <div className="about-team-member">
                <div className="about-team-member-image manager"></div>
                <h3 className="about-team-member-name">Nguyễn Hoàng Vũ</h3>
                <p className="about-team-member-position">CEO</p>
                <p className="about-team-member-description">Được biết đến như là một nhà đầu tư tài chính khét tiếng, ông Vũ đã từng làm việc tại nhiều công ty lớn trên thế giới và được đánh giá là một trong những tay chơi tài chính đẳng cấp nhất mọi thời đại. Ông Vũ nắm trong tay 80% cổ phần của Vunewbie.</p>
              </div>
              <div className="about-team-member">
                <div className="about-team-member-image service"></div>
                <h3 className="about-team-member-name">Warren Buffett</h3>
                <p className="about-team-member-position">Giám Đốc Điều Hành - Co-Founder</p>
                <p className="about-team-member-description">Ông Warren Buffett chịu trách nhiệm đảm bảo mỗi khách hàng đều có trải nghiệm tuyệt vời tại Vunewbie. Với phương châm "Khách hàng là trọng tâm", ông đã xây dựng một đội ngũ phục vụ chuyên nghiệp, thân thiện và luôn sẵn sàng đáp ứng mọi nhu cầu của khách hàng.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About; 