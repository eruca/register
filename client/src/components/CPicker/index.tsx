import Taro, { Dispatch } from "@tarojs/taro";
import { View, Picker, Text } from "@tarojs/components";

const valueMapColor = new Map<number, string>([
  [-4, "#191970"],
  [-3, "#1E90FF"],
  [-2, "#00BFFF"],
  [-1, "#87CEEB"],
  [0, "black"],
  [1, "#DDA0DD"],
  [2, "#EE82EE"],
  [3, "#FF00FF"],
  [4, "#8B008B"],
  [5, "#8F009B"]
]);

export interface ICPickerProps {
  items: Array<string>;
  scores: Array<number>;
  text: string;
  index: number;
  setIndex: Dispatch<number>;
  abs?: boolean;
}

export default function CPicker({
  items = [],
  scores = [],
  text = "",
  index = 0,
  setIndex,
  abs = true
}: ICPickerProps) {
  return (
    <Picker
      mode="selector"
      range={items}
      onChange={v => setIndex(parseInt(v.detail.value, 10))}
      value={index}
    >
      <View style={{ borderBottom: "1PX solid #d6e4ef" }}>
        <View
          style={{
            margin: "10PX 5PX",
            padding: "5PX"
          }}
        >
          {text}:
          <View style={{ float: "right" }}>
            <View
              style={{
                display: "inline-block",
                color: valueMapColor.get(scores[index]) || "black",
                borderBottom: "1PX solid #808080",
                marginRight: "10PX"
              }}
            >
              {items[index]}
              {scores.length > 0 && (
                <Text style={{ color: "grey", fontSize: "0.6em" }}>
                  {" "}
                  [{abs ? Math.abs(scores[index]) : scores[index]}]
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </Picker>
  );
}

CPicker.options = {
  addGlobalClass: true
};
