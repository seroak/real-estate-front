"use client";
import { useState, useRef, useEffect } from "react";
import { useShallow } from "zustand/shallow";
interface Props {
  areaRange: [number, number];
  setAreaRange: (range: [number, number]) => void;
}
import { useSearchFilterStore } from "@/src/store/searchFilterStore";
const AreaRangeInput = () => {
  const { areaRange, setAreaRange } = useSearchFilterStore(
    useShallow((state) => ({
      areaRange: state.areaRange,
      setAreaRange: state.setAreaRange,
    }))
  );

  const [toggle, setToggle] = useState({ minArea: false, maxArea: false });

  const [tempAreaMin, setTempAreaMin] = useState(areaRange[0]);
  const [tempAreaMax, setTempAreaMax] = useState(areaRange[1]);

  const areaMinRef = useRef<HTMLInputElement>(null);
  const areaMaxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTempAreaMin(areaRange[0]);
    setTempAreaMax(areaRange[1]);
  }, [areaRange]);

  return (
    <section className="flex justify-end py-4 bg-white rounded-b">
      <div className="flex flex-col gap-6">
        <div>
          <div className="mb-1 font-semibold text-sm">면적</div>
          <div className="text-xs text-gray-600 mb-2">
            {tempAreaMin === 0 ? "최소 면적" : tempAreaMin + "m²"} ~{" "}
            {tempAreaMax === Infinity ? "최대 면적" : tempAreaMax + "m²"}
          </div>
          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-1">
              <button
                className="border rounded px-2 py-1"
                onClick={() => {
                  const newVal = Math.max(0, tempAreaMin - 1);
                  setTempAreaMin(newVal);
                  setAreaRange([newVal, tempAreaMax]);
                }}
              >
                -
              </button>
              {toggle.minArea ? (
                <input
                  type="text"
                  max={231}
                  placeholder="최소 면적"
                  value={tempAreaMin === 0 ? "" : tempAreaMin}
                  ref={areaMinRef}
                  onBlur={() => {
                    if (tempAreaMin > tempAreaMax) {
                      setAreaRange([tempAreaMin, tempAreaMin]);
                      setTempAreaMax(tempAreaMin);
                    } else {
                      setAreaRange([tempAreaMin, tempAreaMax]);
                    }
                    setToggle((prev) => ({ ...prev, minArea: false }));
                  }}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (!isNaN(val)) setTempAreaMin(val > 231 ? 231 : val);
                  }}
                  className="border rounded px-2 py-1 w-32 cursor-text bg-white
             focus:ring focus:ring-blue-500 focus:ring-opacity-75 focus:outline-none transition-all duration-300 ease-in-out" // 수정된 부분
                  autoFocus
                />
              ) : (
                <input
                  type="text"
                  readOnly
                  className="border rounded px-2 py-1 w-32 cursor-text bg-white
             focus:ring focus:ring-blue-500 focus:ring-opacity-75 focus:outline-none transition-all duration-300 ease-in-out" // 이 부분을 수정했습니다.
                  value={areaRange[0] === 0 ? "최소 면적" : areaRange[0] + "m²"}
                  onClick={() => {
                    setToggle((prev) => ({ ...prev, minArea: true }));
                    setTimeout(() => areaMinRef.current?.focus(), 0);
                  }}
                />
              )}
              <button
                className="border rounded px-2 py-1"
                onClick={() => {
                  const newVal = Math.min(231, tempAreaMin + 1);
                  setTempAreaMin(newVal);
                  setAreaRange([newVal, tempAreaMax]);
                }}
              >
                +
              </button>
            </div>
            <span>~</span>
            <div className="flex items-center gap-1">
              <button
                className="border rounded px-2 py-1"
                onClick={() => {
                  const newVal = Math.max(0, (tempAreaMax === Infinity ? 232 : tempAreaMax) - 1);
                  setTempAreaMax(newVal);
                  setAreaRange([tempAreaMin, newVal]);
                }}
              >
                -
              </button>
              {toggle.maxArea ? (
                <input
                  type="text"
                  max={231}
                  placeholder="최대 면적"
                  value={tempAreaMax === Infinity ? "" : tempAreaMax}
                  ref={areaMaxRef}
                  onBlur={() => {
                    let finalValue = tempAreaMax > 231 ? Infinity : tempAreaMax;
                    if (finalValue < tempAreaMin) {
                      setAreaRange([finalValue, finalValue]);
                      setTempAreaMin(finalValue);
                    } else {
                      setAreaRange([tempAreaMin, finalValue]);
                    }

                    setToggle((prev) => ({ ...prev, maxArea: false }));
                  }}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (!isNaN(val)) setTempAreaMax(val);
                    if (val === 0) {
                      setAreaRange([areaRange[0], Infinity]);
                    }
                  }}
                  className="border rounded px-2 py-1 w-32 cursor-text bg-white focus:ring focus:ring-blue-500 focus:ring-opacity-75 focus:outline-none transition-all duration-300 ease-in-out"
                  autoFocus
                />
              ) : (
                <input
                  type="text"
                  readOnly
                  className="border rounded px-2 py-1 w-32 cursor-text bg-white focus:ring focus:ring-blue-500 focus:ring-opacity-75 focus:outline-none transition-all duration-300 ease-in-out"
                  value={areaRange[1] === Infinity ? "최대 면적" : areaRange[1] + "m²"}
                  onClick={() => {
                    setToggle((prev) => ({ ...prev, maxArea: true }));
                    setTimeout(() => areaMaxRef.current?.focus(), 0);
                  }}
                />
              )}
              <button
                className="border rounded px-2 py-1"
                onClick={() => {
                  const currentVal = tempAreaMax === Infinity ? 231 : tempAreaMax;
                  let newVal = currentVal + 1;
                  if (newVal > 231) {
                    newVal = Infinity;
                  }
                  setTempAreaMax(newVal);
                  setAreaRange([tempAreaMin, newVal]);
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default AreaRangeInput;
