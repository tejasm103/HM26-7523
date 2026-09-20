import React, { useEffect, useState } from 'react';
import { 
  Send, 
  Sparkles, 
  MapPin, 
  Compass, 
  Waves, 
  Droplets, 
  Trash2, 
  Construction, 
  Lightbulb, 
  Zap, 
  Building2, 
  ShieldAlert,
  HelpCircle,
  ImagePlus,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PRESET_COMPLAINTS, CIVIC_CATEGORIES } from '../data/presetComplaints.js';
import { sounds } from '../services/soundEffects.js';

const ICON_MAP = {
  Waves,
  Droplets,
  Trash2,
  Construction,
  Lightbulb,
  Zap,
  Building2,
  ShieldAlert
};

export function ComplaintForm({ 
  onSubmitComplaint, 
  selectedCoordinates, 
  onCoordinatesChange,
  mapLocationName,
  isAnalyzing,
  lang = 'en',
  t 
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('DRAINAGE');
  const [locationName, setLocationName] = useState('Bogadi 2nd Stage, Ring Road Junction');
  const [pincode, setPincode] = useState('570026');
  const [selectedPresetId, setSelectedPresetId] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoError, setPhotoError] = useState('');

  useEffect(() => {
    if (mapLocationName) setLocationName(mapLocationName);
  }, [mapLocationName]);

  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setTitle(lang === 'kn' ? preset.titleKn : preset.title);
    setDescription(preset.description);
    setCategory(preset.category);
    setLocationName(preset.locationName);
    setPincode(preset.pincode);
    onCoordinatesChange(preset.coordinates);
    sounds.playClick();
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoError('Please choose an image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Photo must be smaller than 5 MB.');
      return;
    }

    setPhotoError('');
    const reader = new FileReader();
    reader.onload = () => setPhoto({ name: file.name, dataUrl: reader.result });
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() && !description.trim()) return;

    sounds.playSuccess();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {}

    onSubmitComplaint({
      title,
      description,
      category,
      locationName,
      coordinates: selectedCoordinates,
      pincode,
      photo
    });
  };

  return (
    <div className="glass-card">
      <div className="card-header">
        <div className="card-title-row">
          <h2 className="card-title">
            <Compass size={22} style={{ color: 'var(--color-mcc)' }} />
            <span>{t.fileComplaint}</span>
          </h2>
        </div>
        <p className="card-subtitle">{t.fileComplaintDesc}</p>
      </div>

      {/* Preset Scenarios Chips */}
      <div className="presets-section">
        <div className="presets-label">
          <Sparkles size={13} style={{ color: '#fbbf24' }} />
          <span>{t.quickPresets}</span>
        </div>
        <div className="presets-grid">
          {PRESET_COMPLAINTS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                className={`preset-chip ${isSelected ? 'active' : ''}`}
                onClick={() => handleSelectPreset(preset)}
                title={preset.notes}
              >
                <MapPin size={12} style={{ color: isSelected ? '#fff' : 'var(--color-mcc)' }} />
                <span>{lang === 'kn' ? preset.titleKn.slice(0, 32) + '...' : preset.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Complaint Form */}
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="form-group">
          <label className="form-label">{t.complaintTitleLabel}</label>
          <input
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t.complaintTitlePlaceholder}
            required
          />
        </div>

        {/* Categories Grid */}
        <div className="form-group">
          <label className="form-label">{t.categoryLabel}</label>
          <div className="categories-grid">
            {CIVIC_CATEGORIES.map((cat) => {
              const Icon = ICON_MAP[cat.icon] || Waves;
              const isSelected = category === cat.id;
              return (
                <div
                  key={cat.id}
                  className={`category-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    setCategory(cat.id);
                    sounds.playClick();
                  }}
                >
                  <div className="category-icon-box">
                    <Icon size={18} />
                  </div>
                  <span className="category-name">
                    {lang === 'kn' ? cat.labelKn : cat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label className="form-label">{t.complaintDescLabel}</label>
          <textarea
            className="form-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t.complaintDescPlaceholder}
            required
          />
        </div>

        {/* Location & Pincode */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">{t.locationLabel}</label>
            <input
              type="text"
              className="form-input"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder={t.locationPlaceholder}
              required
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">{t.pincodeLabel}</label>
            <input
              type="text"
              className="form-input"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder={t.pincodePlaceholder}
            />
          </div>
        </div>

        {/* Supporting Photo */}
        <div className="form-group">
          <label className="form-label" htmlFor="complaint-photo">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <ImagePlus size={15} style={{ color: 'var(--color-mcc)' }} />
              <span>Photo evidence (optional)</span>
            </span>
          </label>
          <input
            id="complaint-photo"
            type="file"
            className="form-input"
            accept="image/*"
            onChange={handlePhotoChange}
          />
          {photoError && <div style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.35rem' }}>{photoError}</div>}
          {photo && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.65rem' }}>
              <img src={photo.dataUrl} alt="Complaint preview" style={{ width: 72, height: 56, objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }} />
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>{photo.name}</span>
              <button type="button" className="btn-icon" onClick={removePhoto} aria-label="Remove photo" title="Remove photo">
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        {/* GIS Coordinates Live Readout */}
        <div className="form-group">
          <div className="coord-badge-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={14} style={{ color: 'var(--color-mcc)' }} />
              <span>{t.coordinatesLabel}</span>
            </div>
            <div className="coord-vals">
              Lat: {selectedCoordinates.lat.toFixed(4)}°N | Lng: {selectedCoordinates.lng.toFixed(4)}°E
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <button 
          type="submit" 
          className="btn-primary" 
          disabled={isAnalyzing}
          style={{ opacity: isAnalyzing ? 0.7 : 1 }}
        >
          {isAnalyzing ? (
            <span>{t.routingInProgress}</span>
          ) : (
            <>
              <Sparkles size={18} />
              <span>{t.submitButton}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
