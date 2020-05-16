import { useState } from "@tarojs/taro";

// 年龄
export function gen_ages(defaultIndex = 0) {
  const [index, setIndex] = useState(defaultIndex);
  return {
    index,
    setIndex,
    items: ["0~44", "45~54", "55~64", "65~75", "75~"],
    scores: [0, 2, 3, 5, 6],
    text: "年龄(岁)"
  };
}

// 肛温
export function gen_retalTemp(defaultIndex = 4) {
  const [index, setIndex] = useState(defaultIndex);
  return {
    index,
    setIndex,
    items: [
      "~29.9",
      "30~31.9",
      "32~33.9",
      "34~35.9",
      "36~38.4",
      "38.5~38.9",
      "39~40.9",
      "41~"
    ],
    scores: [-4, -3, -2, -1, 0, 1, 3, 4],
    text: "肛温(℃)"
  };
}

// 平均动脉压
export function gen_map(defaultIndex = 2) {
  const [index, setIndex] = useState(defaultIndex);
  return {
    index,
    setIndex,
    items: ["~49", "50~69", "70~109", "110~129", "130~159", "160~"],
    scores: [-4, -2, 0, 2, 3, 4],
    text: "平均动脉压(mmHg)"
  };
}

// 心率
export function gen_heartRate(defaultIndex = 3) {
  const [index, setIndex] = useState(defaultIndex);
  return {
    index,
    setIndex,
    items: ["~39", "40~54", "55~69", "70~109", "110~139", "140~179", "180~"],
    scores: [-4, -3, -2, 0, 2, 3, 4],
    text: "心率(bmp)"
  };
}

// 呼吸频率
export function gen_respirateRate(defaultIndex = 3) {
  const [index, setIndex] = useState(defaultIndex);
  return {
    index,
    setIndex,
    items: ["~5", "6~9", "10~11", "12~24", "25~34", "35~49", "50~"],
    scores: [-4, -2, -1, 0, 1, 3, 4],
    text: "呼吸频率(次/分)"
  };
}

// 吸氧浓度
export function gen_fio2(fio2: boolean) {
  return {
    items: fio2
      ? ["~200", "200~400", "400~500", "500~"]
      : ["~55", "55~60", "60~70", "70~"],
    scores: fio2 ? [0, 2, 3, 4] : [-4, -3, -1, 0],
    text: fio2 ? "AaDaO2(mmHg)" : "PaO2(mmHg)"
  };
}

// 血气分析:
export function gen_ph(bg: boolean) {
  return {
    items: bg
      ? ["≤15", "15~17.9", "18~21.9", "22~31.9", "32~40.9", "41~51.9", "≥52"]
      : [
          "≤7.14",
          "7.15~7.24",
          "7.25~7.32",
          "7.33~7.49",
          "7.5~7.59",
          "7.6~7.69",
          "≥7.7"
        ],
    scores: bg ? [-4, -3, -2, 0, 1, 3, 4] : [-4, -3, -2, 0, 1, 3, 4],
    text: bg ? "静脉血HCO3-(mmol/L)" : "动脉血pH"
  };
}

// 血钠水平
export function gen_na(defaultIndex = 3) {
  const [index, setIndex] = useState(defaultIndex);

  return {
    index,
    setIndex,
    items: [
      "≤110",
      "111~119",
      "120~129",
      "130~149",
      "150~154",
      "155~159",
      "160~179",
      "≥180"
    ],
    scores: [-4, -3, -2, 0, 1, 2, 3, 4],
    text: "血钠(mmol/L)"
  };
}

// 血钾水平
export function gen_k(defaultIndex = 3) {
  const [index, setIndex] = useState(defaultIndex);

  return {
    index,
    setIndex,
    items: ["<2.5", "2.5~2.9", "3~3.4", "3.5~5.4", "5.5~5.9", "6~6.9", "≥7"],
    scores: [-4, -2, -1, 0, 1, 3, 4],
    text: "血钾(mmol/L)"
  };
}

// 血肌酐水平
export function gen_cr(defaultIndex = 1) {
  const [index, setIndex] = useState(defaultIndex);

  return {
    index,
    setIndex,
    items: ["<53", "53~123", "124~175", "176~308", "≥309"],
    scores: [-1, 0, 2, 3, 4],
    text: "血肌酐(mmol/L)"
  };
}

// 红细胞压积
export function rbc_compress_volume(defaultIndex = 2) {
  const [index, setIndex] = useState(defaultIndex);

  return {
    index,
    setIndex,
    items: ["<20", "20~29.9", "30~45.9", "46~49.9", "50~59.9", "≥60"],
    scores: [-4, -2, 0, 1, 2, 4],
    text: "红细胞压积(%)"
  };
}

// 白细胞计数
export function wbc_count(defaultIndex = 2) {
  const [index, setIndex] = useState(defaultIndex);

  return {
    index,
    setIndex,
    items: ["<1.0", "1.0~2.9", "3~14.9", "15~19.9", "20~39.9", "≥40"],
    scores: [-4, -2, 0, 1, 2, 4],
    text: "白细胞计数(×10^9/L)"
  };
}
