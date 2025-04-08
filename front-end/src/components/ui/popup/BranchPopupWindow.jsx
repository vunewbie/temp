import React, { useState, useEffect } from 'react';
import { updateBranchInfoAPI } from '../../../api/establishments/BranchAPI';
import { listAreaInfoAPI } from '../../../api/establishments/AreaAPI';
import { 
    branchIcon, addressIcon, phoneNumberIcon, areaIcon, 
    openingTimeIcon, closingTimeIcon, carParkingLotIcon, motorbikeParkingLotIcon 
} from '../../../assets';
import './BranchPopupWindow.css';

const BranchPopupWindow = ({ branchInfo, onClose }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [areas, setAreas] = useState([]);
    
    const [branchData, setBranchData] = useState({
        name: '',
        address: '',
        phone_number: '',
        area: null,
        areaName: '',
        opening_time: '',
        closing_time: '',
        car_parking_lot: false,
        motorbike_parking_lot: false
    });

    useEffect(() => {
        if (branchInfo) {
            setBranchData({
                name: branchInfo.name || '',
                address: branchInfo.address || '',
                phone_number: branchInfo.phone_number || '',
                area: branchInfo.area || null,
                areaName: '',
                opening_time: branchInfo.opening_time || '08:00:00',
                closing_time: branchInfo.closing_time || '23:00:00',
                car_parking_lot: branchInfo.car_parking_lot !== undefined ? branchInfo.car_parking_lot : true,
                motorbike_parking_lot: branchInfo.motorbike_parking_lot !== undefined ? branchInfo.motorbike_parking_lot : true
            });
        }
    }, [branchInfo]);

    useEffect(() => {
        const fetchAreas = async () => {
            try {
                const areasData = await listAreaInfoAPI();
                setAreas(areasData);
                
                // Find area name if area ID exists
                if (branchInfo.area) {
                    const area = areasData.find(a => a.id === branchInfo.area);
                    if (area) {
                        setBranchData(prev => ({
                            ...prev,
                            areaName: `${area.district}, ${area.city}`
                        }));
                    }
                }
            } catch (err) {
                console.error('Lỗi khi lấy danh sách khu vực:', err);
            }
        };
        
        fetchAreas();
    }, [branchInfo.area]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');
        
        try {
            const hasChanged = Object.keys(branchData).some(
                key => {
                    if (key === 'areaName') return false; // Ignore areaName since it's not part of the API
                    return branchData[key] !== branchInfo[key]
                }
            );

            if (!hasChanged) {
                setSuccess('Không có thông tin nào được thay đổi.');
                setIsLoading(false);
                setIsEditing(false);
                return;
            }

            // Prepare data for API
            const updateData = {};
            
            if (branchData.name !== branchInfo.name) {
                updateData.name = branchData.name;
            }
            if (branchData.address !== branchInfo.address) {
                updateData.address = branchData.address;
            }
            if (branchData.phone_number !== branchInfo.phone_number) {
                updateData.phone_number = branchData.phone_number;
            }
            if (branchData.area !== branchInfo.area) {
                updateData.area = branchData.area;
            }
            if (branchData.opening_time !== branchInfo.opening_time) {
                updateData.opening_time = branchData.opening_time;
            }
            if (branchData.closing_time !== branchInfo.closing_time) {
                updateData.closing_time = branchData.closing_time;
            }
            if (branchData.car_parking_lot !== branchInfo.car_parking_lot) {
                updateData.car_parking_lot = branchData.car_parking_lot;
            }
            if (branchData.motorbike_parking_lot !== branchInfo.motorbike_parking_lot) {
                updateData.motorbike_parking_lot = branchData.motorbike_parking_lot;
            }
            
            await updateBranchInfoAPI(branchInfo.id, updateData);
            
            setSuccess('Thông tin đã được cập nhật thành công.');
            setIsEditing(false);
            
            setTimeout(() => {
                onClose();
            }, 1500);
            
        } catch (err) {
            console.error('Lỗi khi cập nhật thông tin chi nhánh:', err);
            
            if (err.response && err.response.data) {
                const firstErrorField = Object.keys(err.response.data)[0];
                const firstError = err.response.data[firstErrorField][0];
                setError(firstError);
            } else {
                setError('Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại sau.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    if (isLoading && !branchData.name && !branchData.address) {
        return (
            <div className="branch-popup-container">
                <div className="branch-popup-window">
                    <h2>Thông tin chi nhánh</h2>
                    <div className="branch-popup-loading">Đang tải dữ liệu...</div>
                </div>
            </div>
        );
    }
    
    const formatTimeForInput = (timeString) => {
        if (!timeString) return '';
        return timeString.substring(0, 5);
    };

    const formatTimeForAPI = (timeString) => {
        if (!timeString) return '';
        return timeString + ':00';
    };
    
    return (
        <div className="branch-popup-container">
            <div className="branch-popup-window">
                <button 
                    className="branch-popup-close-button"
                    onClick={onClose}
                    title="Đóng"
                >
                    &times;
                </button>
                <h2>Thông tin chi nhánh</h2>
                
                {error && <div className="branch-popup-error-message">{error}</div>}
                {success && <div className="branch-popup-success-message">{success}</div>}
                
                <div className="branch-popup-form-header">
                    <div className="branch-popup-user-actions">
                        {!isEditing ? (
                            <button 
                                type="button" 
                                className="branch-popup-edit-button"
                                onClick={() => setIsEditing(true)}
                            >
                                Chỉnh sửa thông tin
                            </button>
                        ) : (
                            <div className="branch-popup-edit-actions">
                                <button 
                                    type="button" 
                                    className="branch-popup-cancel-button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setBranchData({
                                            name: branchInfo.name || '',
                                            address: branchInfo.address || '',
                                            phone_number: branchInfo.phone_number || '',
                                            area: branchInfo.area || null,
                                            areaName: branchData.areaName || '',
                                            opening_time: branchInfo.opening_time || '08:00:00',
                                            closing_time: branchInfo.closing_time || '23:00:00',
                                            car_parking_lot: branchInfo.car_parking_lot !== undefined ? branchInfo.car_parking_lot : true,
                                            motorbike_parking_lot: branchInfo.motorbike_parking_lot !== undefined ? branchInfo.motorbike_parking_lot : true
                                        });
                                    }}
                                >
                                    Hủy
                                </button>
                                <button 
                                    type="button" 
                                    className="branch-popup-save-button"
                                    disabled={isLoading}
                                    onClick={handleSubmit}
                                >
                                    {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                
                <form className="branch-popup-form">
                    <div className="branch-popup-form-row">
                        <div className="branch-popup-form-group">
                            <label>
                                <span className="branch-popup-form-icon-wrapper">
                                    <img src={branchIcon} alt="Tên chi nhánh" className="branch-popup-form-field-icon" />
                                    Tên chi nhánh:
                                </span>
                            </label>
                            <input
                                type="text"
                                value={branchData.name}
                                onChange={(e) => setBranchData({ ...branchData, name: e.target.value })}
                                disabled={!isEditing}
                                className="branch-popup-form-input"
                            />
                        </div>
                        <div className="branch-popup-form-group">
                            <label>
                                <span className="branch-popup-form-icon-wrapper">
                                    <img src={addressIcon} alt="Địa chỉ" className="branch-popup-form-field-icon" />
                                    Địa chỉ:
                                </span>
                            </label>
                            <input
                                type="text"
                                value={branchData.address}
                                onChange={(e) => setBranchData({ ...branchData, address: e.target.value })}
                                disabled={!isEditing}
                                className="branch-popup-form-input"
                            />
                        </div>
                    </div>
                    
                    <div className="branch-popup-form-row">
                        <div className="branch-popup-form-group">
                            <label>
                                <span className="branch-popup-form-icon-wrapper">
                                    <img src={phoneNumberIcon} alt="Số điện thoại" className="branch-popup-form-field-icon" />
                                    Số điện thoại:
                                </span>
                            </label>
                            <input
                                type="text"
                                value={branchData.phone_number}
                                onChange={(e) => setBranchData({ ...branchData, phone_number: e.target.value })}
                                disabled={!isEditing}
                                className="branch-popup-form-input"
                            />
                        </div>
                        <div className="branch-popup-form-group">
                            <label>
                                <span className="branch-popup-form-icon-wrapper">
                                    <img src={areaIcon} alt="Khu vực" className="branch-popup-form-field-icon" />
                                    Khu vực:
                                </span>
                            </label>
                            {isEditing ? (
                                <select
                                    value={branchData.area || ''}
                                    onChange={(e) => {
                                        const areaId = e.target.value ? parseInt(e.target.value) : null;
                                        const selectedArea = areas.find(a => a.id === areaId);
                                        setBranchData({ 
                                            ...branchData, 
                                            area: areaId,
                                            areaName: selectedArea ? `${selectedArea.district}, ${selectedArea.city}` : ''
                                        });
                                    }}
                                    className="branch-popup-form-select"
                                >
                                    <option value="">-- Chọn khu vực --</option>
                                    {areas.map(area => (
                                        <option key={area.id} value={area.id}>
                                            {area.district}, {area.city}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    value={branchData.areaName || 'Chưa thiết lập'}
                                    disabled
                                    className="branch-popup-form-input"
                                />
                            )}
                        </div>
                    </div>
                    
                    <div className="branch-popup-form-row">
                        <div className="branch-popup-form-group">
                            <label>
                                <span className="branch-popup-form-icon-wrapper">
                                    <img src={openingTimeIcon} alt="Giờ mở cửa" className="branch-popup-form-field-icon" />
                                    Giờ mở cửa:
                                </span>
                            </label>
                            <input
                                type="time"
                                value={formatTimeForInput(branchData.opening_time)}
                                onChange={(e) => setBranchData({ 
                                    ...branchData, 
                                    opening_time: formatTimeForAPI(e.target.value) 
                                })}
                                disabled={!isEditing}
                                className="branch-popup-form-input"
                            />
                        </div>
                        <div className="branch-popup-form-group">
                            <label>
                                <span className="branch-popup-form-icon-wrapper">
                                    <img src={closingTimeIcon} alt="Giờ đóng cửa" className="branch-popup-form-field-icon" />
                                    Giờ đóng cửa:
                                </span>
                            </label>
                            <input
                                type="time"
                                value={formatTimeForInput(branchData.closing_time)}
                                onChange={(e) => setBranchData({ 
                                    ...branchData, 
                                    closing_time: formatTimeForAPI(e.target.value) 
                                })}
                                disabled={!isEditing}
                                className="branch-popup-form-input"
                            />
                        </div>
                    </div>
                    
                    <div className="branch-popup-form-row">
                        <div className="branch-popup-form-group">
                            <label>
                                <span className="branch-popup-form-icon-wrapper">
                                    <img src={carParkingLotIcon} alt="Bãi đỗ ô tô" className="branch-popup-form-field-icon" />
                                    Bãi đỗ ô tô:
                                </span>
                            </label>
                            {isEditing ? (
                                <div className="branch-popup-form-toggle">
                                    <label className="branch-popup-toggle-switch">
                                        <input 
                                            type="checkbox"
                                            checked={branchData.car_parking_lot}
                                            onChange={(e) => setBranchData({
                                                ...branchData,
                                                car_parking_lot: e.target.checked
                                            })}
                                        />
                                        <span className="branch-popup-toggle-slider"></span>
                                    </label>
                                    <span className="branch-popup-toggle-label">
                                        {branchData.car_parking_lot ? 'Có' : 'Không'}
                                    </span>
                                </div>
                            ) : (
                                <input
                                    type="text"
                                    value={branchData.car_parking_lot ? 'Có' : 'Không'}
                                    disabled
                                    className="branch-popup-form-input"
                                />
                            )}
                        </div>
                        <div className="branch-popup-form-group">
                            <label>
                                <span className="branch-popup-form-icon-wrapper">
                                    <img src={motorbikeParkingLotIcon} alt="Bãi đỗ xe máy" className="branch-popup-form-field-icon" />
                                    Bãi đỗ xe máy:
                                </span>
                            </label>
                            {isEditing ? (
                                <div className="branch-popup-form-toggle">
                                    <label className="branch-popup-toggle-switch">
                                        <input 
                                            type="checkbox"
                                            checked={branchData.motorbike_parking_lot}
                                            onChange={(e) => setBranchData({
                                                ...branchData,
                                                motorbike_parking_lot: e.target.checked
                                            })}
                                        />
                                        <span className="branch-popup-toggle-slider"></span>
                                    </label>
                                    <span className="branch-popup-toggle-label">
                                        {branchData.motorbike_parking_lot ? 'Có' : 'Không'}
                                    </span>
                                </div>
                            ) : (
                                <input
                                    type="text"
                                    value={branchData.motorbike_parking_lot ? 'Có' : 'Không'}
                                    disabled
                                    className="branch-popup-form-input"
                                />
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BranchPopupWindow; 