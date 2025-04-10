import React from 'react';
import './PaginationBar.css';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

const PaginationBar = ({ currentPage, totalPages, onPageChange }) => {
  // Tạo mảng các số trang sẽ hiển thị
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // Luôn hiển thị trang đầu tiên
    pageNumbers.push(1);
    
    // Tính toán phạm vi trang hiển thị xung quanh trang hiện tại
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Nếu trang hiện tại gần trang đầu
    if (currentPage <= 3) {
      endPage = Math.min(4, totalPages - 1);
    }
    
    // Nếu trang hiện tại gần trang cuối
    if (currentPage >= totalPages - 2) {
      startPage = Math.max(2, totalPages - 3);
    }
    
    // Thêm dấu "..." nếu cần
    if (startPage > 2) {
      pageNumbers.push('...');
    }
    
    // Thêm các trang ở giữa
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    // Thêm dấu "..." nếu cần
    if (endPage < totalPages - 1) {
      pageNumbers.push('...');
    }
    
    // Luôn hiển thị trang cuối cùng nếu có nhiều hơn 1 trang
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  // Xử lý sự kiện khi click vào một trang
  const handlePageClick = (page) => {
    if (page !== '...' && page !== currentPage) {
      onPageChange(page);
    }
  };

  // Xử lý sự kiện khi click vào nút Previous
  const handlePrevClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // Xử lý sự kiện khi click vào nút Next
  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Nếu chỉ có 1 trang, không hiển thị pagination
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination-container">
      <button 
        className={`pagination-arrow ${currentPage === 1 ? 'disabled' : ''}`}
        onClick={handlePrevClick}
        disabled={currentPage === 1}
      >
        <IoChevronBack />
      </button>
      
      <div className="pagination-numbers">
        {getPageNumbers().map((page, index) => (
          <div
            key={index}
            className={`pagination-number ${page === currentPage ? 'active' : ''} ${page === '...' ? 'dots' : ''}`}
            onClick={() => handlePageClick(page)}
          >
            {page}
          </div>
        ))}
      </div>
      
      <button 
        className={`pagination-arrow ${currentPage === totalPages ? 'disabled' : ''}`}
        onClick={handleNextClick}
        disabled={currentPage === totalPages}
      >
        <IoChevronForward />
      </button>
    </div>
  );
};

export default PaginationBar;
