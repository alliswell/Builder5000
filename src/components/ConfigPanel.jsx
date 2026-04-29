import { WOOD_TYPES, FINISH_TYPES, APRON_STYLES, LEG_STYLES } from '../constants/woodTypes'

function SectionHeader({ children }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
      {children}
    </h3>
  )
}

function SliderRow({ label, value, min, max, step, unit, onChange }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm text-neutral-300">{label}</label>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={e => onChange(Number(e.target.value))}
            className="w-16 text-right text-sm bg-neutral-700 text-neutral-100 rounded px-1 py-0.5 border border-neutral-600 focus:outline-none focus:border-amber-500"
          />
          <span className="text-xs text-neutral-500">{unit}</span>
        </div>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-amber-500 cursor-pointer"
      />
    </div>
  )
}

function RadioGroup({ options, value, onChange, showDesc }) {
  return (
    <div className="space-y-2">
      {options.map(opt => (
        <label
          key={opt.id}
          className={`flex items-start gap-2 p-2 rounded cursor-pointer border transition-colors ${
            value === opt.id
              ? 'border-amber-500 bg-amber-500/10'
              : 'border-neutral-700 hover:border-neutral-500'
          }`}
        >
          <input
            type="radio"
            name={opt.id + '-group'}
            value={opt.id}
            checked={value === opt.id}
            onChange={() => onChange(opt.id)}
            className="mt-0.5 accent-amber-500"
          />
          <div>
            <span className="text-sm text-neutral-200">{opt.label}</span>
            {showDesc && opt.desc && (
              <p className="text-xs text-neutral-500 mt-0.5">{opt.desc}</p>
            )}
          </div>
        </label>
      ))}
    </div>
  )
}

export default function ConfigPanel({ config, onChange, onExport, woodColor }) {
  const set = (key) => (val) => onChange(prev => ({ ...prev, [key]: val }))

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-4 border-b border-neutral-700">
        <h1 className="text-lg font-semibold text-neutral-100">Table Configurator</h1>
        <p className="text-xs text-neutral-500 mt-0.5">Design your custom table</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">

        {/* Dimensions */}
        <div>
          <SectionHeader>Dimensions</SectionHeader>
          <SliderRow label="Width"          value={config.width}     min={24}   max={96} step={1}    unit="in" onChange={set('width')} />
          <SliderRow label="Depth"          value={config.depth}     min={18}   max={48} step={1}    unit="in" onChange={set('depth')} />
          <SliderRow label="Height"         value={config.height}    min={24}   max={42} step={1}    unit="in" onChange={set('height')} />
          <SliderRow label="Top Thickness"  value={config.thickness} min={0.75} max={3}  step={0.25} unit="in" onChange={set('thickness')} />
          <SliderRow label="Leg Size"       value={config.legSize}   min={1.5}  max={4}  step={0.25} unit="in" onChange={set('legSize')} />
        </div>

        <div className="border-t border-neutral-700" />

        {/* Wood Type */}
        <div>
          <SectionHeader>Wood Type</SectionHeader>
          <select
            value={config.woodType}
            onChange={e => {
              const wood = WOOD_TYPES.find(w => w.id === e.target.value)
              onChange(prev => ({
                ...prev,
                woodType: e.target.value,
                customColor: wood ? wood.hex : prev.customColor,
              }))
            }}
            className="w-full bg-neutral-700 text-neutral-100 text-sm rounded px-3 py-2 border border-neutral-600 focus:outline-none focus:border-amber-500"
          >
            {WOOD_TYPES.map(w => (
              <option key={w.id} value={w.id}>{w.label}</option>
            ))}
          </select>
          {/* Color swatch preview */}
          <div className="flex items-center gap-2 mt-2">
            <div
              className="w-6 h-6 rounded border border-neutral-600"
              style={{ backgroundColor: woodColor }}
            />
            <span className="text-xs text-neutral-500">Current finish color</span>
          </div>
        </div>

        <div className="border-t border-neutral-700" />

        {/* Finish */}
        <div>
          <SectionHeader>Finish</SectionHeader>
          <div className="space-y-2">
            {FINISH_TYPES.map(f => (
              <label
                key={f.id}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer border transition-colors ${
                  config.finish === f.id
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-neutral-700 hover:border-neutral-500'
                }`}
              >
                <input
                  type="radio"
                  value={f.id}
                  checked={config.finish === f.id}
                  onChange={() => set('finish')(f.id)}
                  className="accent-amber-500"
                />
                <span className="text-sm text-neutral-200">{f.label}</span>
              </label>
            ))}
          </div>
          {config.finish === 'custom' && (
            <div className="mt-3 flex items-center gap-3">
              <label className="text-sm text-neutral-300">Color</label>
              <input
                type="color"
                value={config.customColor}
                onChange={e => set('customColor')(e.target.value)}
                className="w-10 h-8 rounded cursor-pointer border border-neutral-600 bg-transparent"
              />
              <span className="text-xs text-neutral-500 font-mono">{config.customColor}</span>
            </div>
          )}
        </div>

        <div className="border-t border-neutral-700" />

        {/* Apron Style */}
        <div>
          <SectionHeader>Apron Style</SectionHeader>
          <RadioGroup
            options={APRON_STYLES}
            value={config.apronStyle}
            onChange={set('apronStyle')}
            showDesc
          />
        </div>

        <div className="border-t border-neutral-700" />

        {/* Leg Style */}
        <div>
          <SectionHeader>Leg Style</SectionHeader>
          <RadioGroup
            options={LEG_STYLES}
            value={config.legStyle}
            onChange={set('legStyle')}
            showDesc={false}
          />
        </div>
      </div>

      {/* Export button */}
      <div className="px-4 py-4 border-t border-neutral-700">
        <button
          onClick={onExport}
          className="w-full bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white font-semibold text-sm py-3 rounded-lg transition-colors"
        >
          Download SketchUp Model (.glb)
        </button>
        <p className="text-xs text-neutral-500 text-center mt-2">
          Import in SketchUp 2021+ via File &gt; Import
        </p>
      </div>
    </div>
  )
}
