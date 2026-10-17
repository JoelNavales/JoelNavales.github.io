import HeroStage from './hero/HeroStage';
import './page-visuals.css';

export default function AboutVisual() {
  return (
    <div className="about-portrait about-visual">
      <div className="about-visual-heading">
        <span className="mono">A FEW THINGS THAT MAKE ME, ME</span>
        <span aria-hidden="true">✳</span>
      </div>
      <HeroStage />
      <p className="about-visual-note mono">A FEW OF MY FAVORITE THINGS, AWAY FROM THE KEYBOARD.</p>
    </div>
  );
}
