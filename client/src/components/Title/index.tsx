import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";

import "./index.scss";

export interface IProps {
  title: string;
}

export default function Title({ title }: IProps) {
  return <View className="view--bar">{title}</View>;
}
