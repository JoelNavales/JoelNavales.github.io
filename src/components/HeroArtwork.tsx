export default function HeroArtwork() {
  return (
    <div className="hero-art" aria-hidden="true">
      <div className="art-orbit" />
      <div className="art-coordinate mono">
        WEB · MOBILE · DESIGN
        <br />
        FROM A LITTLE CORNER OF CEBU.
      </div>
      <div className="code-window">
        <div className="window-bar">
          <span />
          <span />
          <span />
          <span className="window-name mono">hello_world.dart</span>
        </div>
        <div className="code-content">
          <span className="code-comment">// a work in progress, always.</span>
          <br />
          <br />
          <span className="code-purple">class</span> <span className="code-yellow">Joel</span> {'{'}
          <br />
          &nbsp; <span className="code-purple">final</span> curiosity ={' '}
          <span className="code-green">true</span>;<br />
          &nbsp; <span className="code-purple">final</span> home ={' '}
          <span className="code-green">'Cebu, PH'</span>;<br />
          <br />
          &nbsp; <span className="code-yellow">build</span>() {'{'}
          <br />
          &nbsp; &nbsp; learn();
          <br />
          &nbsp; &nbsp; create();
          <br />
          &nbsp; &nbsp; repeat();
          <br />
          &nbsp; {'}'}
          <br />
          {'}'}
          <span className="code-caret" />
        </div>
        <div className="window-footer mono">
          <span>✦ IDEAS INTO SOMETHING REAL</span>
        </div>
      </div>
      <div className="design-sticker">
        <span className="sticker-cross">+</span>
        <span className="sticker-cross">+</span>
        <span className="sticker-cross">+</span>
        <span className="sticker-cross">+</span>
        <span className="design-word">
          make
          <br />
          <i>it matter.</i>
        </span>
        <svg className="sticker-cursor" viewBox="0 0 40 48">
          <path
            d="M5 3v35l10-9 8 15 8-4-8-15 13-2Z"
            fill="#262626"
            stroke="#f6f4ed"
            strokeWidth="2"
          />
        </svg>
      </div>
      <div className="learning-seal">
        <svg viewBox="0 0 120 120">
          <defs>
            <path id="seal-text" d="M60 60m-43 0a43 43 0 1 1 86 0a43 43 0 1 1-86 0" />
          </defs>
          <text>
            <textPath href="#seal-text">ALWAYS LEARNING · ALWAYS BUILDING · </textPath>
          </text>
          <path
            d="M40 65q20 29 40 0M46 44v9m28-9v9"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="art-caption">
        <svg viewBox="0 0 80 55">
          <path
            d="M2 3q50-2 51 39m-12-9 12 12 12-11"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
        <span>built on curiosity.</span>
      </div>
    </div>
  );
}
