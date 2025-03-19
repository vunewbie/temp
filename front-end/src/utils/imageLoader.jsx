const importAll = (r) => {
  return r.keys().map(r);
};

// Intro Images
const introContext = import.meta.glob('../assets/home/intro/*.{png,jpg,jpeg,svg}', { eager: true });
export const introImages = Object.values(introContext).map(module => module.default);

// Branch Images
const hanoiContext = import.meta.glob('../assets/home/hn/*.{png,jpg,jpeg,svg}', { eager: true });
const danangContext = import.meta.glob('../assets/home/dn/*.{png,jpg,jpeg,svg}', { eager: true });
const hochiminhContext = import.meta.glob('../assets/home/hcm/*.{png,jpg,jpeg,svg}', { eager: true });

export const branchImages = {
  hanoi: Object.values(hanoiContext).map(module => module.default),
  danang: Object.values(danangContext).map(module => module.default),
  hochiminh: Object.values(hochiminhContext).map(module => module.default)
};

// Branch Introduction
export const branchInfo = {
  hanoi: [
    { title: "Vunewbie Hà Nội - Hoàn Kiếm", description: "15 Hàng Gai, Hoàn Kiếm, Hà Nội" },
    { title: "Vunewbie Hà Nội - Đống Đa", description: "168 Xã Đàn, Đống Đa, Hà Nội" },
    { title: "Vunewbie Hà Nội - Cầu Giấy", description: "92 Xuân Thủy, Cầu Giấy, Hà Nội" },
    { title: "Vunewbie Hà Nội - Tây Hồ", description: "236 Thụy Khuê, Tây Hồ, Hà Nội" },
    { title: "Vunewbie Hà Nội - Long Biên", description: "25 Nguyễn Văn Cừ, Long Biên, Hà Nội" },
    { title: "Vunewbie Hà Nội - Thanh Xuân", description: "128 Nguyễn Trãi, Thanh Xuân, Hà Nội" }
  ],
  danang: [
    { title: "Vunewbie Đà Nẵng - Hải Châu", description: "58 Bạch Đằng, Hải Châu, Đà Nẵng" },
    { title: "Vunewbie Đà Nẵng - Sơn Trà", description: "192 Ngô Quyền, Sơn Trà, Đà Nẵng" },
    { title: "Vunewbie Đà Nẵng - Ngũ Hành Sơn", description: "15 Lê Văn Hiến, Ngũ Hành Sơn, Đà Nẵng" },
    { title: "Vunewbie Đà Nẵng - Thanh Khê", description: "356 Điện Biên Phủ, Thanh Khê, Đà Nẵng" },
    { title: "Vunewbie Đà Nẵng - Liên Chiểu", description: "82 Nguyễn Lương Bằng, Liên Chiểu, Đà Nẵng" },
    { title: "Vunewbie Đà Nẵng - Cẩm Lệ", description: "168 Cách Mạng Tháng 8, Cẩm Lệ, Đà Nẵng" }
  ],
  hochiminh: [
    { title: "Vunewbie HCM - Quận 1", description: "123 Lê Lợi, Quận 1, TP.HCM" },
    { title: "Vunewbie HCM - Quận 3", description: "45 Võ Văn Tần, Quận 3, TP.HCM" },
    { title: "Vunewbie HCM - Quận 5", description: "256 Trần Hưng Đạo, Quận 5, TP.HCM" },
    { title: "Vunewbie HCM - Quận 7", description: "92 Nguyễn Thị Thập, Quận 7, TP.HCM" },
    { title: "Vunewbie HCM - Phú Nhuận", description: "179 Phan Xích Long, Phú Nhuận, TP.HCM" },
    { title: "Vunewbie HCM - Bình Thạnh", description: "235 Xô Viết Nghệ Tĩnh, Bình Thạnh, TP.HCM" }
  ]
}; 