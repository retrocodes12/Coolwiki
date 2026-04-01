module.exports = {
  extract: {
    include: ['index.html', 'app.js']
  },
  theme: {
    extend: {
      colors: {
        void: '#09090B',
        panel: '#11131A',
        plasma: '#161926',
        'panel-2': '#161926',
        outline: '#F6F0E6',
        acid: '#DFFE00',
        cyan: '#14F1FF',
        pink: '#FF4FD8',
        signal: '#FF6B35',
        paper: '#FFF9EA',
        ink: '#111111',
        muted: '#9CA3AF'
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace']
      },
      borderWidth: {
        3: '3px',
        5: '5px'
      },
      boxShadow: {
        brutal: '8px 8px 0 0 #111111',
        acid: '8px 8px 0 0 #DFFE00',
        cyan: '8px 8px 0 0 #14F1FF',
        pink: '8px 8px 0 0 #FF4FD8',
        mini: '4px 4px 0 0 #DFFE00'
      },
      letterSpacing: {
        brutal: '-0.08em'
      }
    }
  }
};
