import HeroStage from './hero/HeroStage';
import './page-visuals.css';

export default function AboutVisual() {
  return (
    <div className="about-portrait about-visual">
      <div className="about-visual-heading">
        <span className="mono">A FEW THINGS THAT MAKE ME, ME</span>
      </div>
      <HeroStage />
    </div>
  );
}
