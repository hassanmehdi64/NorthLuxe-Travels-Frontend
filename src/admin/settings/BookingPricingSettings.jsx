import { Plus, Trash2 } from "lucide-react";

const ensurePricingShape = (settings) => {
  const bookingPricing = settings.bookingPricing || {};
  return {
    dailyBaseFee: bookingPricing.dailyBaseFee ?? 0,
    perGuestDailyFee: bookingPricing.perGuestDailyFee ?? 0,
    mealsDailyRate: bookingPricing.mealsDailyRate ?? 0,
    insuranceRate: bookingPricing.insuranceRate ?? 0,
    airportTransferRate: bookingPricing.airportTransferRate ?? 0,
    hotelCategories: Array.isArray(bookingPricing.hotelCategories)
      ? bookingPricing.hotelCategories
      : [],
    vehicleTypes: Array.isArray(bookingPricing.vehicleTypes)
      ? bookingPricing.vehicleTypes
      : [],
  };
};

const numberInput = (value) => Number(value || 0);

const BookingPricingSettings = ({ settings, setSettings }) => {
  const pricing = ensurePricingShape(settings);
  const paymentConfig = settings.paymentConfig || {};

  const updatePricing = (next) =>
    setSettings((prev) => ({
      ...prev,
      bookingPricing: { ...pricing, ...next },
    }));

  const updateOption = (key, index, patch) => {
    const list = [...pricing[key]];
    list[index] = { ...list[index], ...patch };
    updatePricing({ [key]: list });
  };

  const addOption = (key, labelPrefix) => {
    const list = [...pricing[key]];
    list.push({
      key: `${labelPrefix}_${list.length + 1}`,
      label: `${labelPrefix} ${list.length + 1}`,
      dailyRate: 0,
      active: true,
    });
    updatePricing({ [key]: list });
  };

  const removeOption = (key, index) => {
    const list = [...pricing[key]];
    list.splice(index, 1);
    updatePricing({ [key]: list });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
      <div className="grid md:grid-cols-2 gap-5">
        <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={paymentConfig.allowManualVerification !== false}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                paymentConfig: {
                  ...prev.paymentConfig,
                  allowManualVerification: e.target.checked,
                },
              }))
            }
          />
          Allow manual payment verification (EasyPaisa/JazzCash)
        </label>
        <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={paymentConfig.requireVerifiedPaymentForCard !== false}
            onChange={(e) =>
              setSettings((prev) => ({
                ...prev,
                paymentConfig: {
                  ...prev.paymentConfig,
                  requireVerifiedPaymentForCard: e.target.checked,
                },
              }))
            }
          />
          Require verified card payment before booking confirmation
        </label>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <label className="space-y-2">
          <span className="text-[10px] font-black uppercase text-slate-400 px-1">Daily Base Fee</span>
          <input
            type="number"
            className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-100"
            value={pricing.dailyBaseFee}
            onChange={(e) => updatePricing({ dailyBaseFee: numberInput(e.target.value) })}
          />
        </label>
        <label className="space-y-2">
          <span className="text-[10px] font-black uppercase text-slate-400 px-1">Per Guest Daily Fee</span>
          <input
            type="number"
            className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-100"
            value={pricing.perGuestDailyFee}
            onChange={(e) => updatePricing({ perGuestDailyFee: numberInput(e.target.value) })}
          />
        </label>
        <label className="space-y-2">
          <span className="text-[10px] font-black uppercase text-slate-400 px-1">Meals Daily Rate</span>
          <input
            type="number"
            className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-100"
            value={pricing.mealsDailyRate}
            onChange={(e) => updatePricing({ mealsDailyRate: numberInput(e.target.value) })}
          />
        </label>
        <label className="space-y-2">
          <span className="text-[10px] font-black uppercase text-slate-400 px-1">Insurance (Per Guest)</span>
          <input
            type="number"
            className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-100"
            value={pricing.insuranceRate}
            onChange={(e) => updatePricing({ insuranceRate: numberInput(e.target.value) })}
          />
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="text-[10px] font-black uppercase text-slate-400 px-1">Airport Transfer Rate</span>
          <input
            type="number"
            className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-100"
            value={pricing.airportTransferRate}
            onChange={(e) => updatePricing({ airportTransferRate: numberInput(e.target.value) })}
          />
        </label>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Hotel Categories</h3>
          <button type="button" onClick={() => addOption("hotelCategories", "hotel")} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold inline-flex items-center gap-2">
            <Plus size={14} /> Add Hotel
          </button>
        </div>
        <div className="space-y-3">
          {pricing.hotelCategories.map((item, index) => (
            <div key={`${item.key}-${index}`} className="grid grid-cols-[1fr_1.2fr_140px_120px_40px] gap-2">
              <input className="p-3 rounded-xl bg-slate-50 font-medium" value={item.key} onChange={(e) => updateOption("hotelCategories", index, { key: e.target.value })} />
              <input className="p-3 rounded-xl bg-slate-50 font-medium" value={item.label} onChange={(e) => updateOption("hotelCategories", index, { label: e.target.value })} />
              <input type="number" className="p-3 rounded-xl bg-slate-50 font-medium" value={item.dailyRate} onChange={(e) => updateOption("hotelCategories", index, { dailyRate: numberInput(e.target.value) })} />
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
                <input type="checkbox" checked={item.active !== false} onChange={(e) => updateOption("hotelCategories", index, { active: e.target.checked })} />
                Active
              </label>
              <button type="button" onClick={() => removeOption("hotelCategories", index)} className="text-rose-600">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Vehicle Types</h3>
          <button type="button" onClick={() => addOption("vehicleTypes", "vehicle")} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold inline-flex items-center gap-2">
            <Plus size={14} /> Add Vehicle
          </button>
        </div>
        <div className="space-y-3">
          {pricing.vehicleTypes.map((item, index) => (
            <div key={`${item.key}-${index}`} className="grid grid-cols-[1fr_1.2fr_140px_120px_40px] gap-2">
              <input className="p-3 rounded-xl bg-slate-50 font-medium" value={item.key} onChange={(e) => updateOption("vehicleTypes", index, { key: e.target.value })} />
              <input className="p-3 rounded-xl bg-slate-50 font-medium" value={item.label} onChange={(e) => updateOption("vehicleTypes", index, { label: e.target.value })} />
              <input type="number" className="p-3 rounded-xl bg-slate-50 font-medium" value={item.dailyRate} onChange={(e) => updateOption("vehicleTypes", index, { dailyRate: numberInput(e.target.value) })} />
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
                <input type="checkbox" checked={item.active !== false} onChange={(e) => updateOption("vehicleTypes", index, { active: e.target.checked })} />
                Active
              </label>
              <button type="button" onClick={() => removeOption("vehicleTypes", index)} className="text-rose-600">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingPricingSettings;
