import { IntroProps } from "../../types/intro"; 

const Intro = ({ onFinish }: IntroProps) => {
  // 버튼 클릭 시 onFinish를 호출하는 컴포넌트
  return (
    <button onClick={onFinish}>Finish</button>
  );
};

export default Intro;
