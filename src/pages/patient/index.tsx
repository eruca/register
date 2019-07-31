import Taro, { useState, Dispatch } from "@tarojs/taro";
import { View } from "@tarojs/components";

import { AtForm, AtInput, AtButton, AtSwitch, AtMessage } from "taro-ui";

const reNumber = /^(?:[1-9]|[1-9]\d|1[1-3]\d)$/;
function testNumber_1_139(v: string): boolean {
  return reNumber.test(v);
}

const bedNum = /^(?:[1-9]|[1-9]\d)$/;
function test_1_99(v: string): boolean {
  return bedNum.test(v);
}

function wrap(fn: Dispatch<any>, fn2: (v: string) => boolean, message: string) {
  return function(v: string) {
    if (v === "") {
      return;
    }
    if (!fn2(v)) {
      Taro.atMessage({
        message: `输入错误:${message}`,
        type: "error"
      });
      fn("");
    } else {
      fn(v);
    }
  };
}

export default function Patient() {
  const [name, setName] = useState("");
  const [hospId, setHospID] = useState("");
  const [isMale, setIsMale] = useState(true);
  const [age, setAge] = useState("");
  const onAgeChange = wrap(setAge, testNumber_1_139, "年龄在1-139之间");
  const [bed, setBed] = useState(1);
  const onBedChange = wrap(setBed, test_1_99, "床号在1-100之间");

  return (
    <View>
      <AtMessage />
      <AtForm onSubmit={() => {}} onReset={() => {}}>
        <AtInput
          name="name"
          title="姓名:"
          type="text"
          value={name}
          autoFocus={true}
          onChange={(v: string) => setName(v)}
        />
        <AtInput
          name="hospId"
          title="病案号:"
          type="text"
          value={hospId}
          onChange={(v: string) => setHospID(v)}
        />
        <AtSwitch
          title={`性别: ${isMale ? "男" : "女"}`}
          checked={isMale}
          onChange={v => setIsMale(v)}
        />
        <AtInput
          name="age"
          title="年龄(岁):"
          type="text"
          placeholder="1-139"
          value={age}
          onChange={onAgeChange}
        />
        <AtInput
          name="bed"
          title="床号:"
          type="text"
          placeholder="1-100"
          value={bed}
          onChange={onBedChange}
        />
        <AtButton formType="submit">提交</AtButton>
        <AtButton formType="reset">重置</AtButton>
      </AtForm>
    </View>
  );
}

Patient.config = {
  navigationBarTitleText: "登记内容"
};
