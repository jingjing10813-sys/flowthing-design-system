import React from 'react';

const Foundations = ({ referenceOnly = false }) => {
  return (
    <div className="doc-section">
      {!referenceOnly && <><h1 className="doc-title">Design Token</h1><p className="doc-intro">Reference, System, Component의 세 단계로 구성된 Flowthing 디자인 토큰입니다.</p></>}
      {/* ========================================= */}
      {/* TIER 1: Reference Tokens                  */}
      {/* ========================================= */}
      <h2 className="tier-title">Tier 1: Reference Tokens (Primitives)</h2>
      <p className="tier-desc">Raw values that define our palette. These should not be used directly in components.</p>
      
      <div className="token-grid">
        {/* Neutral Scale (Pure) */}
        <div className="token-group">
          <h4>Neutral Scale (Pure Grayscale)</h4>
          <p className="sub-desc">Used for shadows, borders, and high-contrast elements. No tint.</p>
          <div className="swatch-row">
            <Swatch name="neutral-0" varName="--ref-palette-neutral-0" />
            <Swatch name="neutral-10" varName="--ref-palette-neutral-10" />
            <Swatch name="neutral-50" varName="--ref-palette-neutral-50" />
            <Swatch name="neutral-100" varName="--ref-palette-neutral-100" />
            <Swatch name="neutral-200" varName="--ref-palette-neutral-200" />
            <Swatch name="neutral-300" varName="--ref-palette-neutral-300" />
            <Swatch name="neutral-400" varName="--ref-palette-neutral-400" />
            <Swatch name="neutral-500" varName="--ref-palette-neutral-500" />
            <Swatch name="neutral-700" varName="--ref-palette-neutral-700" />
            <Swatch name="neutral-1000" varName="--ref-palette-neutral-1000" />
          </div>
        </div>

        {/* Neutral Variant (Cool) */}
        <div className="token-group">
          <h4>Neutral Variant (Cool/Slate)</h4>
          <p className="sub-desc">Used for application backgrounds and UI text to add depth.</p>
          <div className="swatch-row">
            <Swatch name="variant-10" varName="--ref-palette-neutral-variant-10" />
            <Swatch name="variant-20" varName="--ref-palette-neutral-variant-20" />
            <Swatch name="variant-30" varName="--ref-palette-neutral-variant-30" />
            <Swatch name="variant-100" varName="--ref-palette-neutral-variant-100" />
            <Swatch name="variant-600" varName="--ref-palette-neutral-variant-600" />
            <Swatch name="variant-700" varName="--ref-palette-neutral-variant-700" />
            <Swatch name="variant-900" varName="--ref-palette-neutral-variant-900" />
          </div>
        </div>

        {/* Brand & Status Palette */}
        <div className="token-group">
          <h4>Brand & Status</h4>
          <div className="swatch-row">
            <Swatch name="blue-500" varName="--ref-palette-blue-500" />
            <Swatch name="green-400" varName="--ref-palette-green-400" />
            <Swatch name="yellow-500" varName="--ref-palette-yellow-500" />
            <Swatch name="orange-500" varName="--ref-palette-orange-500" />
            <Swatch name="orange-600" varName="--ref-palette-orange-600" />
          </div>
        </div>
      </div>

      <hr className="divider" />

      {/* ========================================= */}
      {/* TIER 2: System Tokens                     */}
      {/* ========================================= */}
      <h2 className="tier-title">Tier 2: System Tokens (Semantics)</h2>
      <p className="tier-desc">Design decisions applied to specific contexts. Use these for global styles.</p>

      <div className="token-grid">
        {/* Typography */}
        <div className="token-group" style={{ gridColumn: '1 / -1' }}>
          <h4>Typography Scale</h4>
          <div className="type-list-group">
             <TypographyRow label="Display L (48px)" varName="--sys-typescale-display-large" text="Ag" />
             <TypographyRow label="Display M (36px)" varName="--sys-typescale-display-medium" text="Ag" />
             <TypographyRow label="Heading L (28px)" varName="--sys-typescale-heading-large" text="The quick brown fox" />
             <TypographyRow label="Heading M (20px)" varName="--sys-typescale-heading-medium" text="The quick brown fox" />
             <TypographyRow label="Body L (18px)" varName="--sys-typescale-body-large" text="The quick brown fox jumps over the lazy dog" />
             <TypographyRow label="Body M (16px)" varName="--sys-typescale-body-medium" text="The quick brown fox jumps over the lazy dog" />
             <TypographyRow label="Body S (14px)" varName="--sys-typescale-body-small" text="The quick brown fox jumps over the lazy dog" />
             <TypographyRow label="Detail (12px)" varName="--sys-typescale-detail" text="The quick brown fox jumps over the lazy dog" />
          </div>
        </div>

        {/* Backgrounds */}
        <div className="token-group">
          <h4>Backgrounds</h4>
          <div className="list-group">
             <TokenRow label="Bg Primary" varName="--sys-color-bg-primary" />
             <TokenRow label="Bg Secondary" varName="--sys-color-bg-secondary" />
             <TokenRow label="Bg Tertiary" varName="--sys-color-bg-tertiary" />
             <TokenRow label="Bg App" varName="--sys-color-bg-app" />
             <TokenRow label="Bg Disabled" varName="--sys-color-bg-disabled" />
             <TokenRow label="Page Bg Start" varName="--sys-color-page-bg-start" />
             <TokenRow label="Page Bg End" varName="--sys-color-page-bg-end" />
          </div>
        </div>

        {/* Text */}
        <div className="token-group">
          <h4>Typography Colors</h4>
          <div className="list-group">
             <TokenRow label="Text Primary" varName="--sys-color-text-primary" />
             <TokenRow label="Text Secondary" varName="--sys-color-text-secondary" />
             <TokenRow label="Text Tertiary" varName="--sys-color-text-tertiary" />
             <TokenRow label="Text Disabled" varName="--sys-color-text-disabled" />
             <TokenRow label="Text Inverse" varName="--sys-color-text-inverse" bg="#333" />
             <TokenRow label="Text Subtle" varName="--sys-color-text-subtle" />
          </div>
        </div>

        {/* Borders */}
        <div className="token-group">
          <h4>Borders</h4>
          <div className="list-group">
             <TokenRow label="Border Primary" varName="--sys-color-border-primary" />
             <TokenRow label="Border Secondary" varName="--sys-color-border-secondary" />
          </div>
        </div>
        
        {/* Shadows */}
        <div className="token-group">
          <h4>Shadows (Elevation & Neumorph)</h4>
          <div className="swatch-row">
            <ShadowSwatch name="Shadow SM" varName="--sys-shadow-sm" />
            <ShadowSwatch name="Shadow MD" varName="--sys-shadow-md" />
            <ShadowSwatch name="Shadow LG" varName="--sys-shadow-lg" />
            <ShadowSwatch name="Neu Flat Light" varName="--sys-shadow-neu-flat-light" />
            <ShadowSwatch name="Neu Flat Dark" varName="--sys-shadow-neu-flat-dark" />
          </div>
        </div>

        {/* Status */}
         <div className="token-group">
          <h4>Status & Temp</h4>
          <div className="swatch-row">
            <Swatch name="Status Active" varName="--sys-color-status-active" />
            <Swatch name="Status Warm" varName="--sys-color-status-warm" />
            <Swatch name="Status Cool" varName="--sys-color-status-cool" />
            <Swatch name="Temp Warm" varName="--sys-color-temp-warm" />
            <Swatch name="Temp Neutral" varName="--sys-color-temp-neutral" />
            <Swatch name="Temp Cool" varName="--sys-color-temp-cool" />
          </div>
        </div>

        {/* Room Gradients */}
        <div className="token-group" style={{ gridColumn: '1 / -1' }}>
          <h4>Room Gradients (Dynamic Overlay)</h4>
          <p className="sub-desc">Start and End colors for room-specific background overlays.</p>
          <div className="swatch-row">
            <Swatch name="Orange Start" varName="--sys-color-gradient-orange-start" />
            <Swatch name="Orange End" varName="--sys-color-gradient-orange-end" />
            
            <Swatch name="Blue Start" varName="--sys-color-gradient-blue-start" />
            <Swatch name="Blue End" varName="--sys-color-gradient-blue-end" />
            
            <Swatch name="Green Start" varName="--sys-color-gradient-green-start" />
            <Swatch name="Green End" varName="--sys-color-gradient-green-end" />
            
            <Swatch name="Purple Start" varName="--sys-color-gradient-purple-start" />
            <Swatch name="Purple End" varName="--sys-color-gradient-purple-end" />
          </div>
        </div>
      </div>

      <hr className="divider" />

      {/* ========================================= */}
      {/* TIER 3: Component Tokens                  */}
      {/* ========================================= */}
      <h2 className="tier-title">Tier 3: Component Tokens</h2>
      <p className="tier-desc">Specific overrides for components. These inherit from System tokens or Reference tokens directly.</p>

      <div className="component-preview-section">
        <h3>Button</h3>
        <div className="preview-row">
            <div className="preview-card">
                <button className="preview-btn-off">Off</button>
                <div className="token-list">
                    <code>bg: --comp-button-bg-enabled</code>
                    <code>text: --comp-button-text-default</code>
                    <code>border: --comp-button-border-default</code>
                </div>
            </div>
            <div className="preview-card">
                <button className="preview-btn-on">On</button>
                <div className="token-list">
                    <code>bg: --comp-button-bg-active</code>
                    <code>color: --comp-button-icon-color-active</code>
                </div>
            </div>
        </div>
      </div>

      <div className="component-preview-section">
        <h3>Slider</h3>
         <div className="token-list">
            <code>thumb-bg: --comp-slider-thumb-bg</code>
            <code>track-bg: --comp-slider-track-bg</code>
        </div>
      </div>

      <div className="component-preview-section">
        <h3>Card</h3>
         <div className="token-list">
            <code>bg: --comp-card-bg</code>
            <code>radius: --comp-card-radius</code>
        </div>
      </div>

      <div className="component-preview-section">
        <h3>Device Info (Text Colors)</h3>
         <div className="token-list">
            <code>name-color: --comp-device-name-color</code>
            <code>name-color-inverse: --comp-device-name-color-inverse</code>
            <code>status-color: --comp-device-status-color</code>
            <code>status-color-inverse: --comp-device-status-color-inverse</code>
        </div>
      </div>

      {/* Internal Styles for this Doc Page */}
      <style>{`
        .doc-title { font-size: 28px; margin-bottom: 8px; color: var(--sys-color-text-primary); }
        .doc-intro { font-size: 16px; color: var(--sys-color-text-secondary); margin-bottom: 40px; line-height: 1.5; }
        
        .tier-title { 
            font-size: 20px; 
            color: var(--sys-color-text-primary); 
            margin-top: 32px; 
            border-left: 4px solid var(--ref-palette-blue-500); 
            padding-left: 12px; 
        }
        .tier-desc { font-size: 14px; color: var(--sys-color-text-tertiary); margin-bottom: 24px; }
        .sub-desc { font-size: 12px; color: var(--sys-color-text-tertiary); margin-bottom: 12px; font-style: italic; }
        
        .divider { border: 0; border-top: 1px solid var(--sys-color-border-primary); margin: 40px 0; }

        .token-grid { display: flex; flex-direction: column; gap: 32px; }
        .token-group h4 { margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: var(--sys-color-text-secondary); text-transform: uppercase;  }

        .swatch-row { display: flex; flex-wrap: wrap; gap: 12px; }
        
        /* Swatch Component */
        .swatch-container { display: flex; flex-direction: column; align-items: center; width: 80px; }
        .swatch-box { 
            width: 80px; height: 60px; 
            border-radius: 8px; 
            border: 1px solid rgba(0,0,0,0.05); 
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            margin-bottom: 8px;
        }
        .swatch-label { font-size: 11px; color: var(--sys-color-text-secondary); text-align: center; }
        .swatch-var { font-size: 9px; color: var(--sys-color-text-tertiary); text-align: center; word-break: break-all; }

        /* List Group */
        .list-group { display: flex; flex-direction: column; gap: 8px; max-width: 400px; }
        .token-row { 
            display: flex; align-items: center; justify-content: space-between; 
            padding: 8px 12px; 
            border-radius: 6px; 
            border: 1px solid var(--sys-color-border-primary);
        }
        .token-preview { width: 24px; height: 24px; border-radius: 50%; border: 1px solid rgba(0,0,0,0.1); margin-right: 12px; }
        .token-preview.is-font { background: none; border: none; font-weight: 700; color: var(--sys-color-text-primary); text-align: center; line-height: 24px; }
        
        .token-info { display: flex; flex-direction: column; }
        .token-name { font-size: 13px; font-weight: 500; color: var(--sys-color-text-primary); }
        .token-var, .type-token-var { font-size: 11px; color: var(--sys-color-text-tertiary); font-family: var(--ref-font-family-base); }
        
        /* Typography Row */
        .type-list-group { display: flex; flex-direction: column; gap: 16px; width: 100%; }
        .type-row { 
            display: flex; align-items: baseline; justify-content: space-between;
            padding-bottom: 12px;
            border-bottom: 1px solid var(--sys-color-border-secondary);
        }
        .type-meta { display: flex; flex-direction: column; width: 200px; flex-shrink: 0; }
        .type-role { font-size: 14px; font-weight: 600; color: var(--sys-color-text-secondary); }
        .type-token-var { color: var(--sys-color-text-tertiary); }
        
        .type-preview { 
            flex-grow: 1; 
            color: var(--sys-color-text-primary); 
            font-family: var(--ref-font-family-base);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* Component Previews */
        .component-preview-section { margin-bottom: 32px; background: var(--sys-color-bg-secondary); padding: 20px; border-radius: 12px; }
        .component-preview-section h3 { margin: 0 0 16px 0; font-size: 16px; color: var(--sys-color-text-primary); }
        .preview-row { display: flex; gap: 24px; }
        .preview-card { display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .token-list { display: flex; flex-direction: column; gap: 4px; font-size: 11px; color: var(--sys-color-text-tertiary); }
        .token-list code { background: rgba(0,0,0,0.05); padding: 2px 4px; border-radius: 4px; }

        /* Manual Button Styles for Preview (referencing vars) */
        .preview-btn-off {
            width: var(--comp-button-size); height: var(--comp-button-size);
            border-radius: var(--comp-button-radius);
            border: 1px solid var(--comp-button-border-default);
            background: var(--comp-button-bg-enabled);
            color: var(--comp-button-text-default);
            cursor: pointer;
            box-shadow: var(--comp-button-shadow-enabled);
        }
        .preview-btn-on {
            width: var(--comp-button-size); height: var(--comp-button-size);
            border-radius: var(--comp-button-radius);
            border: none;
            background: var(--comp-button-bg-active);
            color: var(--comp-button-icon-color-active);
            cursor: pointer;
            box-shadow: var(--comp-button-shadow-active);
        }

      `}</style>
    </div>
  );
};

const Swatch = ({ name, varName }) => (
    <div className="swatch-container">
        <div className="swatch-box" style={{ background: `var(${varName})` }}></div>
        <span className="swatch-label">{name}</span>
        <span className="swatch-var">{varName.replace('--ref-palette-', '').replace('neutral-', 'n-')}</span>
    </div>
);

const ShadowSwatch = ({ name, varName, inset }) => (
    <div className="swatch-container">
        <div className="swatch-box" style={{ background: '#f4f6f8', boxShadow: `var(${varName})`, border: inset ? '1px solid #ddd' : 'none' }}></div>
        <span className="swatch-label">{name}</span>
        <span className="swatch-var">{varName.replace('--sys-shadow-', '')}</span>
    </div>
);

const TokenRow = ({ label, varName, bg = 'transparent', isFont }) => (
    <div className="token-row" style={{ backgroundColor: bg }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className={`token-preview ${isFont ? 'is-font' : ''}`} style={!isFont ? { background: `var(${varName})` } : {}}>
                {isFont && 'Ag'}
            </div>
            <div className="token-info">
                <span className="token-name" style={bg !== 'transparent' ? {color:'#fff'} : {}}>{label}</span>
            </div>
        </div>
        <div className="token-var" style={bg !== 'transparent' ? {color:'rgba(255,255,255,0.7)'} : {}}>{varName}</div>
    </div>
);

const TypographyRow = ({ label, varName, text }) => (
    <div className="type-row">
        <div className="type-meta">
            <span className="type-role">{label}</span>
            <span className="type-token-var">{varName.replace('--sys-typescale-', '')}</span>
        </div>
        <div className="type-preview" style={{ fontSize: `var(${varName})` }}>
            {text}
        </div>
    </div>
);

export default Foundations;
