import Taro, { useState } from '@tarojs/taro';
import { View, Switch } from '@tarojs/components';
import { AtFloatLayout, AtIcon, AtMessage, AtRadio, AtNoticebar, AtCard } from 'taro-ui';

import './index.scss';

function theTips(tipIndex: number): string {
    switch (tipIndex) {
        case 0:
            return '即使不能全面评价（如气管插管、语言障碍、气管创伤及绷带包扎等），检查者也须选择1个反应。只在患者对有害刺激无反应时（不是反射）才记录3分。';

        case 1:
            return '提问当前月份、年龄。仅对初次回答评分。失语和昏迷者不能理解问题记2分，因气管插管、气管创伤、严重构音障碍、语言障碍或其他任何原因不能完成者（非失语所致）记1分。可书面回答。';

        case 2:
            return '睁闭眼；非瘫痪侧握拳松开。每项指令只可重复一次，仅对最初反应评分。有明确努力但由于虚弱而未完成者视为成功。若患者无法理解语言指令，可用动作示意，不影响评分。对创伤、截肢或其他生理缺陷者，应予适当的指令。';

        case 3:
            return '只测试水平眼球运动。对随意或反射性眼球运动记分。若眼球偏斜能被随意或反射性活动纠正，记1分。若为孤立的周围性眼肌麻痹记1分。对失语者，凝视是可以测试的。对眼球创伤、绷带包扎、盲人或有其他视力、视野障碍者，由检查者选择一种反射性运动来测试。与患者建立眼神交流，然后从一侧向另一侧运动，通过患者能否保持眼神接触发现凝视麻痹。';

        case 4:
            return '保持双眼注视前方，遮住一只眼，若能看到另一侧的上或下象限有几根手指，则为正常。若单眼盲或眼球摘除，检查另一只眼。明确的非对称盲（包括象限盲），记1分。若全盲（任何原因）记3分。若濒临死亡记1分。可以通过动作回答。';

        case 5:
            return '面部表情是否对称，要求患者示齿、用力闭眼、抬眉等。若患者无法理解指令，可用动作示意，或予以有害刺激，观察患者表情。';

        case 6:
            return '置肢体于合适的位置：坐位平举90º，卧位上台45º，掌心向下。要求坚持10秒。对失语的病人用语言或动作鼓励，不用有害刺激。评定者可以抬起病人的上肢到要求的位置，鼓励病人坚持。依次检查每个肢体，从非瘫痪侧上肢开始。截肢或关节融合患者跳过此测试，但应做记录。';

        case 7:
            return '下肢卧位抬高30º，坚持5秒；对失语的病人用语言或动作鼓励，不用有害刺激。评定者可以抬起病人下肢到要求的位置，鼓励病人坚持。依次检查每个肢体，从非瘫痪侧下肢开始。截肢或关节融合患者跳过此测试，但应做记录。';

        case 8:
            return '检查时睁眼，若有视力障碍，应确保检查在无视野缺损中进行。进行双侧指鼻试验、跟膝胫试验（每项重复3~4次）。若患者明显虚弱无法完成动作、不能理解治疗或肢体瘫痪不记分。盲人用伸展的上肢摸鼻。从非瘫痪侧开始测试。截肢或关节融合患者跳过此测试，但应做记录。';

        case 9:
            return '检查患者肢体远端对针刺的感觉和观察表情，或意识障碍及失语者对有害刺激的躲避。只对与脑卒中引起的感觉缺失评分。偏身感觉丧失者需要精确检查，应测试身体多处部位：上肢（不包括手）、下肢、躯干、面部。脑干卒中双侧感觉缺失、；脑干卒中双侧感觉缺失者记2分。';

        case 10:
            return '命名、阅读测试：根据一幅图画描述一个场景、阅读几个句子、说出图画上几个物品的名字。记录患者最好的一次得分。若视觉缺损干扰测试，可让患者识别放在手上的物品，重复和发音。气管插管者手写回答。给恍惚或不合作者选择一个记分，但3分仅给不能说话且不能执行任何指令者。';

        case 11:
            return '读或重复表上的词语。若有严重的失语，评估自发语言时发音的清晰度。气管插管或其他物理障碍无法发音者跳过此测试，但应做记录。';

        case 12:
            return '通过检验病人对左右侧同时发生的皮肤感觉和视觉刺激的识别能力来判断病人是否有忽视。若病人严重视觉缺失影响双侧视觉的同时检查，但皮肤刺激均正常，则记分为0。若病人失语，但确实表现为双侧的注意，记分为0。';
        default:
            console.error('should not happened');
            return '';
    }
}

export default function Nihss() {
    const [isFloatLayerOpen, setIsFloatLayerOpen] = useState(false);
    const [tip, setTip] = useState('');

    const getTip = (tipIndex: number) => () => {
        setTip(theTips(tipIndex));
        setIsFloatLayerOpen(true);
    };
    const [locOpen, setLocOpen] = useState(false);

    const [locResp, setLocResp] = useState(0);
    const [locRespOpen, setLocRespOpen] = useState(false);

    const [locQuest, setLocQuest] = useState(0);
    const [locQuestOpen, setLocQuestOpen] = useState(false);

    const [locCommand, setLocCommand] = useState(0);
    const [locCommandOpen, setLocCommandOpen] = useState(false);

    const [gaze, setGaze] = useState(0);
    const [isGazeOpen, setGazeOpen] = useState(false);

    const [vision, setVision] = useState(0);
    const [visionOpen, setVisionOpen] = useState(false);

    const [face, setface] = useState(0);
    const [faceOpen, setfaceOpen] = useState(false);

    const [leftUpperLimb, setLeftUpperLimb] = useState(0);
    const [leftUpperLimbOpen, setLeftUpperLimbOpen] = useState(false);

    const [rightUpperLimb, setRightUpperLimb] = useState(0);
    const [rightUpperLimbOpen, setRightUpperLimbOpen] = useState(false);

    const [leftDownLimb, setLeftDownLimb] = useState(0);
    const [leftDownLimbOpen, setLeftDownLimbOpen] = useState(false);

    const [rightDownLimb, setRightDownLimb] = useState(0);
    const [rightDownLimbOpen, setRightDownLimbOpen] = useState(false);

    const [limbsDisorder, setLimbsDisorder] = useState(0);
    const [limbsDisorderOpen, setlimbsDisorderOpen] = useState(false);

    const [feeling, setFeeling] = useState(0);
    const [feelingOpen, setfeelingOpen] = useState(false);

    const [lang, setLang] = useState(0);
    const [langOpen, setlangOpen] = useState(false);

    const [voice, setVoice] = useState(0);
    const [voiceOpen, setvoiceOpen] = useState(false);

    const [ignore, setIgnore] = useState(0);
    const [ignoreOpen, setignoreOpen] = useState(false);

    const sum =
        locResp +
        locQuest +
        locCommand +
        gaze +
        vision +
        face +
        leftUpperLimb +
        rightUpperLimb +
        leftDownLimb +
        rightDownLimb +
        limbsDisorder +
        feeling +
        lang +
        voice +
        ignore;

    return (
        <View style={{ width: '100vw' }}>
            <AtMessage />
            <AtNoticebar>{`${locResp + locQuest + locCommand} + ${gaze} + ${vision} + ${face} + ${
                leftUpperLimb + rightUpperLimb
            } + ${
                leftDownLimb + rightDownLimb
            } + ${limbsDisorder} + ${feeling} + ${lang} + ${voice} + ${ignore} = ${sum}`}</AtNoticebar>
            <View className="nihss_title">美国国立卫生研究院卒中量表（NIHSS)</View>
            <View className="nihss_list_item">
                <View style={{ marginRight: '2px' }}>1.</View>
                <View className="content">意识水平: {`${locResp + locQuest + locCommand}`}</View>

                <Switch color="#6190E8" onChange={() => setLocOpen(!locOpen)} />
            </View>
            {locOpen && (
                <View style={{ border: '1PX solid #dddddd' }}>
                    <View className="nihss_list_item">
                        <View style={{ margin: '0 2px' }}>1.1</View>
                        <View className="content">反应: {`${locResp}`}</View>

                        <Switch color="#6190E8" onChange={() => setLocRespOpen(!locRespOpen)} />
                        <AtIcon
                            size="25"
                            color="#cc3399"
                            value="help"
                            customStyle={{ marginLeft: '20rpx' }}
                            onClick={getTip(0)}
                        />
                    </View>
                    {locRespOpen && (
                        <AtRadio
                            options={locRespsOptions}
                            value={locResp}
                            onClick={(v) => setLocResp(v)}
                        />
                    )}

                    <View className="nihss_list_item">
                        <View style={{ margin: '0 2px' }}>1.2</View>
                        <View className="content">提问: {`${locQuest}`}</View>

                        <Switch color="#6190E8" onChange={() => setLocQuestOpen(!locQuestOpen)} />
                        <AtIcon
                            size="25"
                            color="#cc3399"
                            value="help"
                            customStyle={{ marginLeft: '20rpx' }}
                            onClick={getTip(1)}
                        />
                    </View>
                    {locQuestOpen && (
                        <AtRadio
                            options={locQuestOptions}
                            value={locQuest}
                            onClick={(v) => setLocQuest(v)}
                        />
                    )}

                    <View className="nihss_list_item">
                        <View style={{ margin: '0 2px' }}>1.3</View>
                        <View className="content">指令: {`${locCommand}`}</View>

                        <Switch
                            color="#6190E8"
                            onChange={() => setLocCommandOpen(!locCommandOpen)}
                        />
                        <AtIcon
                            size="25"
                            color="#cc3399"
                            value="help"
                            customStyle={{ marginLeft: '20rpx' }}
                            onClick={getTip(2)}
                        />
                    </View>
                    {locCommandOpen && (
                        <AtRadio
                            options={locCommandOptions}
                            value={locCommand}
                            onClick={(v) => setLocCommand(v)}
                        />
                    )}
                </View>
            )}

            <View className="nihss_list_item">
                <View style={{ margin: '0 2px' }}>2.</View>
                <View className="content">凝视: {`${gaze}`}</View>

                <Switch color="#6190E8" onChange={() => setGazeOpen(!isGazeOpen)} />
                <AtIcon
                    size="25"
                    color="#cc3399"
                    value="help"
                    customStyle={{ marginLeft: '20rpx' }}
                    onClick={getTip(3)}
                />
            </View>
            {isGazeOpen ? (
                <AtRadio options={gazeOptions} value={gaze} onClick={(v) => setGaze(v)} />
            ) : null}

            <View className="nihss_list_item">
                <View style={{ margin: '0 2px' }}>3.</View>
                <View className="content">视野: {`${vision}`}</View>

                <Switch color="#6190E8" onChange={() => setVisionOpen(!visionOpen)} />
                <AtIcon
                    size="25"
                    color="#cc3399"
                    value="help"
                    customStyle={{ marginLeft: '20rpx' }}
                    onClick={getTip(4)}
                />
            </View>
            {visionOpen && (
                <AtRadio options={视野Options} value={vision} onClick={(v) => setVision(v)} />
            )}

            <View className="nihss_list_item">
                <View style={{ margin: '0 2px' }}>4.</View>
                <View className="content">面瘫: {`${face}`}</View>

                <Switch color="#6190E8" onChange={() => setfaceOpen(!faceOpen)} />
                <AtIcon
                    size="25"
                    color="#cc3399"
                    value="help"
                    customStyle={{ marginLeft: '20rpx' }}
                    onClick={getTip(5)}
                />
            </View>
            {faceOpen && <AtRadio options={面瘫Options} value={face} onClick={(v) => setface(v)} />}

            <View className="nihss_list_item">
                <View style={{ margin: '0 2px' }}>5a.</View>
                <View className="content">左上肢运动: {`${leftUpperLimb}`}</View>

                <Switch color="#6190E8" onChange={() => setLeftUpperLimbOpen(!leftUpperLimbOpen)} />
                <AtIcon
                    size="25"
                    color="#cc3399"
                    value="help"
                    customStyle={{ marginLeft: '20rpx' }}
                    onClick={getTip(6)}
                />
            </View>
            {leftUpperLimbOpen && (
                <AtRadio
                    options={upperLimbOptions}
                    value={leftUpperLimb}
                    onClick={(v) => setLeftUpperLimb(v)}
                />
            )}

            <View className="nihss_list_item">
                <View style={{ margin: '0 2px' }}>5b.</View>
                <View className="content">右上肢运动: {`${rightUpperLimb}`}</View>

                <Switch
                    color="#6190E8"
                    onChange={() => setRightUpperLimbOpen(!rightUpperLimbOpen)}
                />
                <AtIcon
                    size="25"
                    color="#cc3399"
                    value="help"
                    customStyle={{ marginLeft: '20rpx' }}
                    onClick={getTip(6)}
                />
            </View>
            {rightUpperLimbOpen && (
                <AtRadio
                    options={upperLimbOptions}
                    value={rightUpperLimb}
                    onClick={(v) => setRightUpperLimb(v)}
                />
            )}

            <View className="nihss_list_item">
                <View style={{ margin: '0 2px' }}>6a.</View>
                <View className="content">左下肢运动: {`${leftDownLimb}`}</View>

                <Switch color="#6190E8" onChange={() => setLeftDownLimbOpen(!leftDownLimbOpen)} />
                <AtIcon
                    size="25"
                    color="#cc3399"
                    value="help"
                    customStyle={{ marginLeft: '20rpx' }}
                    onClick={getTip(7)}
                />
            </View>
            {leftDownLimbOpen && (
                <AtRadio
                    options={downLimbOptions}
                    value={leftDownLimb}
                    onClick={(v) => setLeftDownLimb(v)}
                />
            )}

            <View className="nihss_list_item">
                <View style={{ margin: '0 2px' }}>6b.</View>
                <View className="content">右下肢运动: {`${rightDownLimb}`}</View>

                <Switch color="#6190E8" onChange={() => setRightDownLimbOpen(!rightDownLimbOpen)} />
                <AtIcon
                    size="25"
                    color="#cc3399"
                    value="help"
                    customStyle={{ marginLeft: '20rpx' }}
                    onClick={getTip(7)}
                />
            </View>
            {rightDownLimbOpen && (
                <AtRadio
                    options={downLimbOptions}
                    value={rightDownLimb}
                    onClick={(v) => setRightDownLimb(v)}
                />
            )}

            <View className="nihss_list_item">
                <View style={{ margin: '0 2px' }}>7.</View>
                <View className="content">肢体共济失调: {`${limbsDisorder}`}</View>

                <Switch color="#6190E8" onChange={() => setlimbsDisorderOpen(!limbsDisorderOpen)} />
                <AtIcon
                    size="25"
                    color="#cc3399"
                    value="help"
                    customStyle={{ marginLeft: '20rpx' }}
                    onClick={getTip(8)}
                />
            </View>
            {limbsDisorderOpen && (
                <AtRadio
                    options={肢体共济失调Options}
                    value={limbsDisorder}
                    onClick={(v) => setLimbsDisorder(v)}
                />
            )}

            <View className="nihss_list_item">
                <View style={{ margin: '0 2px' }}>8.</View>
                <View className="content">感觉: {`${feeling}`}</View>

                <Switch color="#6190E8" onChange={() => setfeelingOpen(!feelingOpen)} />
                <AtIcon
                    size="25"
                    color="#cc3399"
                    value="help"
                    customStyle={{ marginLeft: '20rpx' }}
                    onClick={getTip(9)}
                />
            </View>
            {feelingOpen && (
                <AtRadio options={感觉Options} value={feeling} onClick={(v) => setFeeling(v)} />
            )}

            <View className="nihss_list_item">
                <View style={{ margin: '0 2px' }}>9.</View>
                <View className="content">语言: {`${lang}`}</View>

                <Switch color="#6190E8" onChange={() => setlangOpen(!langOpen)} />
                <AtIcon
                    size="25"
                    color="#cc3399"
                    value="help"
                    customStyle={{ marginLeft: '20rpx' }}
                    onClick={getTip(10)}
                />
            </View>
            {langOpen && <AtRadio options={语言Options} value={lang} onClick={(v) => setLang(v)} />}

            <View className="nihss_list_item">
                <View style={{ margin: '0 2px' }}>10.</View>
                <View className="content">构音障碍: {`${voice}`}</View>

                <Switch color="#6190E8" onChange={() => setvoiceOpen(!voiceOpen)} />
                <AtIcon
                    size="25"
                    color="#cc3399"
                    value="help"
                    customStyle={{ marginLeft: '20rpx' }}
                    onClick={getTip(11)}
                />
            </View>
            {voiceOpen && (
                <AtRadio options={构音障碍Options} value={voice} onClick={(v) => setVoice(v)} />
            )}

            <View className="nihss_list_item">
                <View style={{ margin: '0 2px' }}>11.</View>
                <View className="content">忽视: {`${ignore}`}</View>

                <Switch color="#6190E8" onChange={() => setignoreOpen(!ignoreOpen)} />
                <AtIcon
                    size="25"
                    color="#cc3399"
                    value="help"
                    customStyle={{ marginLeft: '20rpx' }}
                    onClick={getTip(12)}
                />
            </View>
            {ignoreOpen && (
                <AtRadio options={忽视Options} value={ignore} onClick={(v) => setIgnore(v)} />
            )}
            <AtCard>
                <View>
                    1.该量表用于评估最近脑卒中病史患者神经功能缺损程度，总分等于15项参数得分总和，评分越低，患者状态越好，该表灵敏度低；
                </View>
                <View>
                    2.基线评估可以评估卒中严重程度，治疗后可以定期评估治疗效果。基线评估大于16分的患者很有可能死亡，而小于6分的很有可能恢复良好；每增加1分，预后良好的可能性降低17%
                </View>
                <View>
                    3.用于脑梗死溶栓的治疗评定：常用溶栓的评分时间点：溶栓前；溶栓后2小时；溶栓后24小时；溶栓后7天；溶栓后90天。溶栓24小时候NIHSS全部评分下降4分或以上，认为溶栓有效
                </View>
                <View style={{ color: 'red' }}>
                    4.评分分级：分数越高，神经受损越严重，分级如下：
                    <View>• 0-1分：正常或近乎正常；</View>
                    <View>• 1-4分：轻度卒中/小卒中；</View>
                    <View>• 5-15分：中度卒中；</View>
                    <View>• 15-20分：中-重度卒中；</View>
                    <View>• 21-42分：重度卒中</View>
                </View>
                <View>
                    5.目前的国内外研究认为 ：认为基线 NIHSS
                    评分对急性缺血性卒中患者的大血管闭塞具有一定的预测价值，尤其对于前循环大血管闭塞的预测价值较高，但是在预测后循环大血管闭塞时的灵敏度较差；NIHSS
                    评分在预测大血管闭塞时有时间依赖性，发病超过 6 小时后的预测准确性差。
                </View>
            </AtCard>
            <AtFloatLayout
                isOpened={isFloatLayerOpen}
                title="操作说明"
                onClose={() => setIsFloatLayerOpen(false)}
            >
                {tip}
            </AtFloatLayout>
        </View>
    );
}

const locRespsOptions = [
    { label: '➊ 清醒，反应灵敏', value: 0 },
    { label: '➋ 嗜睡，轻微刺激能唤醒，可回答问题，执行指令', value: 1 },
    {
        label: '➌ 昏睡或反应迟钝：需反复刺激、强烈或疼痛刺激才有非刻板的反应',
        value: 2,
    },
    {
        label: '➍ 昏迷：仅有反射性活动或自发性反应或完全无反应、软瘫、无反射',
        value: 3,
    },
];

const locQuestOptions = [
    { label: '➊ 两项均正确', value: 0 },
    { label: '➋ 一项正确或非失语所致如，气管创伤等原因不能完成者', value: 1 },
    {
        label: '➌ 两项均不正确或失语和昏迷者不能理解问题默认昏迷评分(DCS)',
        value: 2,
    },
];

const locCommandOptions = [
    { label: '➊ 两项均正确', value: 0 },
    { label: '➋ 一项正确', value: 1 },
    { label: '➌ 两项均不正确', value: 2 },
];

const gazeOptions = [
    { label: '➊ 正确', value: 0 },
    {
        label:
            '➋ 部分凝视麻痹（单眼或双眼凝视异常，但无强迫凝视或完全凝视麻痹）；孤立的周围性眼肌麻痹',
        value: 1,
    },
    { label: '➌ 强迫凝视或完全凝视麻痹（不能被头眼反射克服）', value: 2 },
];

const 视野Options = [
    { label: '➊ 无视野缺损', value: 0 },
    { label: '➋ 明确的非对称盲（包括象限盲）或部分偏盲或濒临死亡', value: 1 },
    { label: '➌ 完全偏盲', value: 2 },
    { label: '➍ 双侧偏盲（包括皮质盲）或任何原因的全盲', value: 3 },
];

const 面瘫Options = [
    { label: '➊ 正常', value: 0 },
    { label: '➋ 轻微（微笑时鼻唇沟变平，不对称）', value: 1 },
    { label: '➌ 部分（下面部完全或几乎完全瘫痪）', value: 2 },
    { label: '➍ 完全（单或双侧瘫痪，上下面部缺乏运动）', value: 3 },
];

const upperLimbOptions = [
    { label: '➊ 于要求位置，10秒内无下落', value: 0 },
    { label: '➋ 10秒内下落，虽不能保持在要求位置，但未碰到床或其他支持物', value: 1 },
    { label: '➌ 试图抵抗重力，但10秒内下落至床或其他支持物', value: 2 },
    { label: '➍ 无法抵抗重力，肢体立即下落，但仍可做某些运动(例如耸肩)', value: 3 },
    { label: '➎ 无运动，无法引发上肢的随意运动', value: 4 },
];

const downLimbOptions = [
    { label: '➊ 于要求位置，10秒内无下落', value: 0 },
    { label: '➋ 10秒内下落，虽不能保持在要求位置，但未碰到床或其他支持物', value: 1 },
    { label: '➌ 试图抵抗重力，但10秒内下落至床或其他支持物', value: 2 },
    { label: '➍ 无法抵抗重力，肢体立即下落，但仍可做某些运动(例如耸肩)', value: 3 },
    { label: '➎ 无运动，无法引发下肢的随意运动', value: 4 },
];

const 肢体共济失调Options = [
    { label: '➊ 无共济失调：动作流畅、准确', value: 0 },
    { label: '➋ 一个肢体有共济失调：动作僵硬或不准确', value: 1 },
    { label: '➌ 2个或更多肢体有共济失调：一侧肢体动作僵硬或不准确', value: 2 },
];

const 感觉Options = [
    { label: '➊ 无感觉缺失', value: 0 },
    { label: '➋ 轻~中度感觉缺失：患者感觉针刺不尖锐或迟钝，或针刺缺失但有触觉', value: 1 },
    { label: '➌ 一侧重度~完全感觉缺失：单侧肢体完全无触觉默认昏迷评分(DCS)', value: 2 },
];

const 语言Options = [
    { label: '➊ 正常：语言功能无障碍', value: 0 },
    { label: '➋ 轻~中度失语：流利程度和理解能力部分下降，但表达无明显受限', value: 1 },
    { label: '➌ 严重失语：患者语言破碎，听者须推理、询问、猜测，交流困难', value: 2 },
    { label: '➍ 完全失语：无法言语或无听力理解能力,默认昏迷评分(DCS)', value: 3 },
];

const 构音障碍Options = [
    { label: '➊ 正常：发音清晰、流畅', value: 0 },
    { label: '➋ 轻~中度构音障碍：有些发音不清，但能被理解', value: 1 },
    { label: '➌ 严重构音障碍：言语不清，不能被理解，或失音，默认昏迷评分(DCS)', value: 2 },
    { label: '➍ 气管插管或其他物理障碍(记录)', value: 0 },
];

const 忽视Options = [
    { label: '➊ 正常：正确回答所有问题', value: 0 },
    { label: '➋ 视、触、听或空间觉：某一种刺激模式下对一侧的忽视', value: 1 },
    { label: '➌ 偏侧忽视：在一种以上的刺激模式中对同一侧的忽视，默认昏迷评分(DCS)', value: 2 },
];

Nihss.config = {
    navigationBarTitleText: 'NIHSS评分',
};
