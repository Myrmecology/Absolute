/* ============================================================
   ABSOLUTE — js/tabs/media/feed.js
   Media Feed | Posts | Stories | Comments | Like | Share
   Live Activity | Suggestions | Trending | Real-time Feel
   ============================================================ */

const AbsoluteMediaFeed = (() => {

  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------
  let feedData         = null;
  let posts            = [];
  let activityTimer    = null;
  let newPostTimer     = null;

  // ----------------------------------------------------------
  // ELEMENTS
  // ----------------------------------------------------------
  const postsContainer  = document.getElementById('posts-container');
  const storiesBar      = document.getElementById('stories-bar');
  const trendingList    = document.getElementById('trending-list');
  const suggestionsList = document.getElementById('suggestions-list');
  const activityFeed    = document.getElementById('activity-feed');
  const postInput       = document.getElementById('create-post-input');
  const postSubmitBtn   = document.getElementById('post-submit-btn');

  // ----------------------------------------------------------
  // INIT
  // ----------------------------------------------------------
  function init() {
    loadFeedData();
    bindPostSubmit();
  }

  // ----------------------------------------------------------
  // LOAD FEED DATA
  // ----------------------------------------------------------
  function loadFeedData() {
    fetch('data/mock-feed.json')
      .then(r => r.json())
      .then(data => {
        feedData = data;
        posts    = [...data.posts];
        renderStories(data.stories);
        renderPosts(posts);
        renderTrending(data.trending);
        renderSuggestions(data.suggestions);
        renderActivity(data.activity);
        startLiveActivity(data.activity);
        startNewPostTimer();
      })
      .catch(() => {
        feedData = null;
        renderEmptyFeed();
      });
  }

  // ----------------------------------------------------------
  // RENDER STORIES
  // ----------------------------------------------------------
  function renderStories(stories) {
    if (!storiesBar || !stories) return;
    storiesBar.innerHTML = '';

    // Add user's own story first
    const agent = sessionStorage.getItem('absolute_agent') || 'A';
    const myStory = document.createElement('div');
    myStory.className = 'story-item';
    myStory.innerHTML = `
      <div class="story-avatar-wrapper">
        <div class="story-ring"></div>
        <div class="story-avatar" style="background: linear-gradient(135deg, var(--neon-cyan), var(--neon-violet));">
          ${agent.charAt(0).toUpperCase()}
        </div>
      </div>
      <span class="story-name">YOUR STORY</span>
    `;
    storiesBar.appendChild(myStory);

    stories.forEach((story, i) => {
      const el = document.createElement('div');
      el.className = 'story-item';
      el.innerHTML = `
        <div class="story-avatar-wrapper">
          <div class="story-ring ${story.viewed ? 'viewed' : ''}"></div>
          <div class="story-avatar">${story.avatar}</div>
        </div>
        <span class="story-name">${story.name}</span>
      `;

      el.addEventListener('click', () => {
        markStoryViewed(story.id, el);
      });

      storiesBar.appendChild(el);

      if (window.gsap) {
        gsap.fromTo(el,
          { opacity: 0, scale: 0.8 },
          {
            opacity:  1,
            scale:    1,
            duration: 0.3,
            delay:    i * 0.05,
            ease:     'back.out(1.7)'
          }
        );
      }
    });
  }

  // ----------------------------------------------------------
  // MARK STORY VIEWED
  // ----------------------------------------------------------
  function markStoryViewed(id, el) {
    if (!feedData) return;

    const story = feedData.stories.find(s => s.id === id);
    if (story) story.viewed = true;

    const ring = el.querySelector('.story-ring');
    if (ring) ring.classList.add('viewed');

    if (window.gsap) {
      gsap.timeline()
        .to(el, { scale: 1.15, duration: 0.15 })
        .to(el, { scale: 1,    duration: 0.3, ease: 'elastic.out(1, 0.5)' });
    }
  }

  // ----------------------------------------------------------
  // RENDER POSTS
  // ----------------------------------------------------------
  function renderPosts(postsArr) {
    if (!postsContainer) return;
    postsContainer.innerHTML = '';

    postsArr.forEach((post, i) => {
      const el = createPostCard(post);
      postsContainer.appendChild(el);

      if (window.gsap) {
        gsap.fromTo(el,
          { opacity: 0, y: 30 },
          {
            opacity:  1,
            y:        0,
            duration: 0.5,
            delay:    i * 0.1,
            ease:     'power3.out'
          }
        );
      }
    });
  }

  // ----------------------------------------------------------
  // CREATE POST CARD
  // ----------------------------------------------------------
  function createPostCard(post) {
    const el = document.createElement('div');
    el.className = 'post-card';
    el.dataset.id = post.id;

    const hasComments = post.comments_data && post.comments_data.length > 0;

    el.innerHTML = `
      <div class="post-header">
        <div class="post-avatar">${post.avatar}</div>
        <div class="post-user-info">
          <span class="post-username">${post.username}</span>
          <div class="post-meta">
            <span>${post.handle}</span>
            <span class="post-meta-dot"></span>
            <span>${post.timestamp}</span>
            <span class="post-meta-dot"></span>
            <span style="color: var(--neon-violet);">${post.reality}</span>
          </div>
        </div>
        <button class="post-options-btn">···</button>
      </div>

      <div class="post-body">
        <p class="post-text">${formatPostText(post.text)}</p>
      </div>

      ${post.hasImage ? `
        <div class="post-image-wrapper">
          <div class="post-image-placeholder">
            <span style="position: relative; z-index: 1; font-size: 3rem;">${post.imagePlaceholder}</span>
          </div>
        </div>
      ` : ''}

      <div class="post-reactions">
        <div class="reaction-emoji-stack">
          ${post.reactions.map(r => `<span>${r}</span>`).join('')}
        </div>
        <span class="reaction-count">${post.reactionCount.toLocaleString()}</span>
        <div class="reaction-spacer"></div>
        <span class="comment-count">${post.comments} comments</span>
      </div>

      <div class="post-actions">
        <button class="post-action-btn like ${post.liked ? 'liked' : ''}" data-id="${post.id}">
          <span class="post-action-icon">${post.liked ? '❤' : '♡'}</span>
          <span>${post.likes.toLocaleString()}</span>
        </button>
        <button class="post-action-btn comment" data-id="${post.id}">
          <span class="post-action-icon">💬</span>
          <span>Comment</span>
        </button>
        <button class="post-action-btn share" data-id="${post.id}">
          <span class="post-action-icon">↗</span>
          <span>Share</span>
        </button>
      </div>

      ${hasComments ? `
        <div class="post-comments" id="comments-${post.id}">
          ${post.comments_data.map(c => createCommentHTML(c)).join('')}
          <div class="comment-input-row">
            <input
              type="text"
              class="comment-input"
              placeholder="Write a transmission..."
              data-post-id="${post.id}"
            />
            <button class="comment-send-btn" data-post-id="${post.id}">↗</button>
          </div>
        </div>
      ` : ''}
    `;

    // Bind interactions
    bindPostInteractions(el, post);

    return el;
  }

  // ----------------------------------------------------------
  // FORMAT POST TEXT
  // Highlight hashtags and mentions
  // ----------------------------------------------------------
  function formatPostText(text) {
    return text
      .replace(/#(\w+)/g, '<span class="post-hashtag">#$1</span>')
      .replace(/@([\w.]+)/g, '<span class="post-mention">@$1</span>');
  }

  // ----------------------------------------------------------
  // CREATE COMMENT HTML
  // ----------------------------------------------------------
  function createCommentHTML(comment) {
    return `
      <div class="comment-item">
        <div class="comment-avatar">${comment.avatar}</div>
        <div class="comment-bubble">
          <div class="comment-username">${comment.username}</div>
          <div class="comment-text">${comment.text}</div>
        </div>
      </div>
    `;
  }

  // ----------------------------------------------------------
  // BIND POST INTERACTIONS
  // ----------------------------------------------------------
  function bindPostInteractions(el, post) {

    // Like button
    const likeBtn = el.querySelector('.post-action-btn.like');
    if (likeBtn) {
      likeBtn.addEventListener('click', () => {
        toggleLike(post, likeBtn);
      });
    }

    // Comment button
    const commentBtn = el.querySelector('.post-action-btn.comment');
    if (commentBtn) {
      commentBtn.addEventListener('click', () => {
        toggleComments(post.id, el);
      });
    }

    // Share button
    const shareBtn = el.querySelector('.post-action-btn.share');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        animateShare(shareBtn, post);
      });
    }

    // Comment send buttons
    const sendBtns = el.querySelectorAll('.comment-send-btn');
    sendBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const postId = btn.dataset.postId;
        const input  = el.querySelector(`.comment-input[data-post-id="${postId}"]`);
        if (input) submitComment(postId, input, el);
      });
    });

    // Comment input enter key
    const commentInputs = el.querySelectorAll('.comment-input');
    commentInputs.forEach(input => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const postId = input.dataset.postId;
          submitComment(postId, input, el);
        }
      });
    });
  }

  // ----------------------------------------------------------
  // TOGGLE LIKE
  // ----------------------------------------------------------
  function toggleLike(post, btn) {
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;

    const icon  = btn.querySelector('.post-action-icon');
    const count = btn.querySelector('span:last-child');

    if (post.liked) {
      btn.classList.add('liked');
      if (icon) icon.textContent = '❤';
      if (count) count.textContent = post.likes.toLocaleString();

      if (window.gsap) {
        gsap.timeline()
          .to(btn, { scale: 1.3, duration: 0.15 })
          .to(btn, { scale: 1,   duration: 0.3, ease: 'elastic.out(1, 0.5)' });
      }

      spawnLikeParticle(btn);

    } else {
      btn.classList.remove('liked');
      if (icon) icon.textContent = '♡';
      if (count) count.textContent = post.likes.toLocaleString();

      if (window.gsap) {
        gsap.to(btn, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
      }
    }
  }

  // ----------------------------------------------------------
  // LIKE PARTICLE EFFECT
  // ----------------------------------------------------------
  function spawnLikeParticle(btn) {
    const rect = btn.getBoundingClientRect();

    for (let i = 0; i < 6; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        left: ${rect.left + rect.width / 2}px;
        top: ${rect.top + rect.height / 2}px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--neon-red);
        box-shadow: 0 0 6px var(--neon-red);
        pointer-events: none;
        z-index: 9999;
      `;
      document.body.appendChild(particle);

      const angle  = (i / 6) * Math.PI * 2;
      const dist   = 30 + Math.random() * 20;
      const tx     = Math.cos(angle) * dist;
      const ty     = Math.sin(angle) * dist;

      if (window.gsap) {
        gsap.to(particle, {
          x:        tx,
          y:        ty,
          opacity:  0,
          scale:    0,
          duration: 0.6,
          ease:     'power2.out',
          onComplete: () => {
            if (particle.parentNode) particle.parentNode.removeChild(particle);
          }
        });
      } else {
        setTimeout(() => {
          if (particle.parentNode) particle.parentNode.removeChild(particle);
        }, 600);
      }
    }
  }

  // ----------------------------------------------------------
  // TOGGLE COMMENTS
  // ----------------------------------------------------------
  function toggleComments(postId, postEl) {
    const commentsSection = postEl.querySelector(`#comments-${postId}`);

    if (commentsSection) {
      // Toggle existing comments
      if (window.gsap) {
        const isVisible = commentsSection.style.display !== 'none';
        if (isVisible) {
          gsap.to(commentsSection, {
            opacity: 0,
            height:  0,
            duration: 0.3,
            onComplete: () => {
              commentsSection.style.display = 'none';
              commentsSection.style.height  = '';
              commentsSection.style.opacity = '';
            }
          });
        } else {
          commentsSection.style.display = 'flex';
          gsap.fromTo(commentsSection,
            { opacity: 0, height: 0 },
            { opacity: 1, height: 'auto', duration: 0.4, ease: 'power3.out' }
          );
        }
      }
    } else {
      // Create comment section
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      const newSection = document.createElement('div');
      newSection.className = 'post-comments';
      newSection.id        = `comments-${postId}`;
      newSection.innerHTML = `
        <div class="comment-input-row">
          <input
            type="text"
            class="comment-input"
            placeholder="Write a transmission..."
            data-post-id="${postId}"
          />
          <button class="comment-send-btn" data-post-id="${postId}">↗</button>
        </div>
      `;

      postEl.appendChild(newSection);

      // Bind new inputs
      const input   = newSection.querySelector('.comment-input');
      const sendBtn = newSection.querySelector('.comment-send-btn');

      if (input) {
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') submitComment(postId, input, postEl);
        });
      }
      if (sendBtn) {
        sendBtn.addEventListener('click', () => {
          submitComment(postId, input, postEl);
        });
      }

      if (window.gsap) {
        gsap.fromTo(newSection,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
        );
      }

      input?.focus();
    }
  }

  // ----------------------------------------------------------
  // SUBMIT COMMENT
  // ----------------------------------------------------------
  function submitComment(postId, input, postEl) {
    if (!input) return;

    const text = input.value.trim();
    if (!text) return;

    const agent   = sessionStorage.getItem('absolute_agent') || 'Agent';
    const comment = {
      id:        Date.now(),
      username:  agent.toUpperCase(),
      avatar:    agent.charAt(0).toUpperCase(),
      text,
      timestamp: 'just now'
    };

    input.value = '';

    const commentsSection = postEl.querySelector(`#comments-${postId}`);
    if (!commentsSection) return;

    const inputRow   = commentsSection.querySelector('.comment-input-row');
    const commentEl  = document.createElement('div');
    commentEl.className = 'comment-item';
    commentEl.innerHTML = `
      <div class="comment-avatar" style="background: linear-gradient(135deg, var(--neon-cyan), var(--neon-violet)); color: var(--color-void); font-family: var(--font-display); font-weight: 900;">
        ${comment.avatar}
      </div>
      <div class="comment-bubble">
        <div class="comment-username" style="color: var(--neon-cyan);">${comment.username}</div>
        <div class="comment-text">${comment.text}</div>
      </div>
    `;

    if (inputRow) {
      commentsSection.insertBefore(commentEl, inputRow);
    } else {
      commentsSection.appendChild(commentEl);
    }

    if (window.gsap) {
      gsap.fromTo(commentEl,
        { opacity: 0, x: -15, backgroundColor: 'rgba(0, 245, 255, 0.05)' },
        {
          opacity:         1,
          x:               0,
          backgroundColor: 'transparent',
          duration:        0.4,
          ease:            'power3.out'
        }
      );
    }

    // Update comment count
    const post      = posts.find(p => p.id === parseInt(postId));
    if (post) {
      post.comments++;
      const countEl = postEl.querySelector('.comment-count');
      if (countEl) countEl.textContent = `${post.comments} comments`;
    }
  }

  // ----------------------------------------------------------
  // ANIMATE SHARE
  // ----------------------------------------------------------
  function animateShare(btn, post) {
    if (window.gsap) {
      gsap.timeline()
        .to(btn, { scale: 1.2, color: 'var(--neon-violet)', duration: 0.15 })
        .to(btn, { scale: 1,   color: '',                   duration: 0.3, ease: 'elastic.out(1, 0.5)' });
    }

    // Toast notification
    showToast(`Transmission shared — ${post.reality}`);
  }

  // ----------------------------------------------------------
  // BIND POST SUBMIT
  // ----------------------------------------------------------
  function bindPostSubmit() {
    if (!postSubmitBtn || !postInput) return;

    postSubmitBtn.addEventListener('click', () => {
      submitNewPost();
    });

    postInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        submitNewPost();
      }
    });
  }

  // ----------------------------------------------------------
  // SUBMIT NEW POST
  // ----------------------------------------------------------
  function submitNewPost() {
    if (!postInput) return;

    const text = postInput.value.trim();
    if (!text) {
      if (window.gsap) {
        gsap.timeline()
          .to(postInput, { borderColor: 'var(--neon-red)', duration: 0.15 })
          .to(postInput, { borderColor: '', duration: 0.4, delay: 0.5 });
      }
      return;
    }

    const agent = sessionStorage.getItem('absolute_agent') || 'Agent';

    const newPost = {
      id:           Date.now(),
      username:     `AGENT ${agent.toUpperCase()}`,
      handle:       `@${agent.toLowerCase()}.absolute`,
      avatar:       agent.charAt(0).toUpperCase(),
      timestamp:    'just now',
      reality:      'Earth-Prime',
      text,
      hasImage:     false,
      likes:        0,
      comments:     0,
      shares:       0,
      liked:        false,
      reactions:    ['⚡'],
      reactionCount: 0,
      comments_data: []
    };

    posts.unshift(newPost);
    postInput.value = '';

    if (postsContainer) {
      const el = createPostCard(newPost);
      postsContainer.insertBefore(el, postsContainer.firstChild);

      if (window.gsap) {
        gsap.fromTo(el,
          {
            opacity:         0,
            y:               -20,
            backgroundColor: 'rgba(0, 245, 255, 0.05)'
          },
          {
            opacity:         1,
            y:               0,
            backgroundColor: 'transparent',
            duration:        0.6,
            ease:            'power3.out'
          }
        );
      }
    }

    showToast('Transmission broadcast to the network');
    postInput.style.height = '';
  }

  // ----------------------------------------------------------
  // RENDER TRENDING
  // ----------------------------------------------------------
  function renderTrending(trending) {
    if (!trendingList || !trending) return;
    trendingList.innerHTML = '';

    trending.forEach((item, i) => {
      const el = document.createElement('div');
      el.className = 'trending-item';
      el.innerHTML = `
        <span class="trending-rank">#${item.rank} Trending</span>
        <span class="trending-tag">${item.tag}</span>
        <span class="trending-count">${item.count}</span>
      `;

      el.addEventListener('click', () => {
        if (window.gsap) {
          gsap.fromTo(el,
            { backgroundColor: 'rgba(0, 245, 255, 0.05)' },
            { backgroundColor: 'transparent', duration: 0.6 }
          );
        }
      });

      trendingList.appendChild(el);

      if (window.gsap) {
        gsap.fromTo(el,
          { opacity: 0, x: 20 },
          {
            opacity:  1,
            x:        0,
            duration: 0.3,
            delay:    i * 0.06,
            ease:     'power3.out'
          }
        );
      }
    });
  }

  // ----------------------------------------------------------
  // RENDER SUGGESTIONS
  // ----------------------------------------------------------
  function renderSuggestions(suggestions) {
    if (!suggestionsList || !suggestions) return;
    suggestionsList.innerHTML = '';

    suggestions.forEach((suggestion, i) => {
      const el = document.createElement('div');
      el.className = 'suggestion-item';
      el.innerHTML = `
        <div class="suggestion-avatar">${suggestion.avatar}</div>
        <div class="suggestion-info">
          <span class="suggestion-name">${suggestion.name}</span>
          <span class="suggestion-reason">${suggestion.reason}</span>
        </div>
        <button
          class="suggestion-follow-btn ${suggestion.following ? 'following' : ''}"
          data-id="${suggestion.id}"
        >${suggestion.following ? 'Following' : 'Follow'}</button>
      `;

      const followBtn = el.querySelector('.suggestion-follow-btn');
      if (followBtn) {
        followBtn.addEventListener('click', () => {
          toggleFollow(suggestion, followBtn);
        });
      }

      suggestionsList.appendChild(el);

      if (window.gsap) {
        gsap.fromTo(el,
          { opacity: 0, x: 20 },
          {
            opacity:  1,
            x:        0,
            duration: 0.3,
            delay:    i * 0.07,
            ease:     'power3.out'
          }
        );
      }
    });
  }

  // ----------------------------------------------------------
  // TOGGLE FOLLOW
  // ----------------------------------------------------------
  function toggleFollow(suggestion, btn) {
    suggestion.following = !suggestion.following;
    btn.textContent = suggestion.following ? 'Following' : 'Follow';
    btn.classList.toggle('following', suggestion.following);

    if (window.gsap) {
      gsap.timeline()
        .to(btn, { scale: 1.15, duration: 0.15 })
        .to(btn, { scale: 1,    duration: 0.3, ease: 'elastic.out(1, 0.5)' });
    }

    if (suggestion.following) {
      showToast(`Now following ${suggestion.name}`);
    }
  }

  // ----------------------------------------------------------
  // RENDER ACTIVITY
  // ----------------------------------------------------------
  function renderActivity(activity) {
    if (!activityFeed || !activity) return;
    activityFeed.innerHTML = '';

    activity.slice(0, 5).forEach((item, i) => {
      const el = createActivityItem(item, i);
      activityFeed.appendChild(el);
    });
  }

  function createActivityItem(item, delay = 0) {
    const el = document.createElement('div');
    el.className = 'activity-item';
    el.innerHTML = `
      <span class="activity-item-icon">${item.icon}</span>
      <span>${item.text}</span>
      <span class="activity-time">${item.time}</span>
    `;

    if (window.gsap) {
      gsap.fromTo(el,
        { opacity: 0, x: 15 },
        {
          opacity:  1,
          x:        0,
          duration: 0.3,
          delay:    delay * 0.08,
          ease:     'power3.out'
        }
      );
    }

    return el;
  }

  // ----------------------------------------------------------
  // START LIVE ACTIVITY
  // Simulates real-time activity in the feed
  // ----------------------------------------------------------
  function startLiveActivity(initialActivity) {
    if (!activityFeed) return;

    const liveEvents = [
      { icon: '🌀', text: 'ORION opened a portal to Epoch-2157', time: 'now' },
      { icon: '⚡', text: 'FLUX completed dimensional scan', time: 'now' },
      { icon: '🔮', text: 'PRISM filed a reality report', time: 'now' },
      { icon: '◈',  text: 'ZERO accessed Omega database', time: 'now' },
      { icon: '🌟', text: 'VEGA returned from Mirror Realm', time: 'now' },
      { icon: '⚠',  text: 'Temporal anomaly detected — Sector 7', time: 'now' },
      { icon: '💎', text: 'New artefact catalogued — Crystal Expanse', time: 'now' },
      { icon: '⬡',  text: 'ECHO transmitted from Quantum-Null', time: 'now' },
    ];

    let eventIndex = 0;

    activityTimer = setInterval(() => {
      if (!activityFeed) return;

      const event = liveEvents[eventIndex % liveEvents.length];
      eventIndex++;

      const newItem = createActivityItem(event);

      activityFeed.insertBefore(newItem, activityFeed.firstChild);

      // Remove last item if too many
      const items = activityFeed.querySelectorAll('.activity-item');
      if (items.length > 6) {
        const last = items[items.length - 1];
        if (window.gsap) {
          gsap.to(last, {
            opacity: 0,
            height:  0,
            duration: 0.3,
            onComplete: () => {
              if (last.parentNode) last.parentNode.removeChild(last);
            }
          });
        } else {
          if (last.parentNode) last.parentNode.removeChild(last);
        }
      }

    }, 8000);
  }

  // ----------------------------------------------------------
  // START NEW POST TIMER
  // Occasionally injects a new post to simulate live feed
  // ----------------------------------------------------------
  function startNewPostTimer() {
    const autoPostData = [
      {
        username: 'AGENT AXIOM',
        handle:   '@axiom.absolute',
        avatar:   '⚡',
        reality:  'Fracture Zone',
        text:     'The #FractureZone is expanding. Latest readings show a 4.7% increase in dimensional instability near the northern coordinates. All agents in that sector should report in. #Alert #FractureZone'
      },
      {
        username: 'AGENT ECHO',
        handle:   '@echo.absolute',
        avatar:   '⬡',
        reality:  'Quantum-Null',
        text:     'Quantum-Null is quieter than usual today. The signal static that normally blankets this reality has dropped to near zero. Something is absorbing it. #QuantumNull #Anomaly'
      },
      {
        username: 'SYSTEM BROADCAST',
        handle:   '@system.absolute',
        avatar:   '◈',
        reality:  'All Realities',
        text:     'MAINTENANCE NOTICE: Portal array 7 through 12 will be offline for recalibration during the next operational cycle. Plan your departures accordingly. #SystemNotice'
      }
    ];

    let autoPostIndex = 0;
    const intervals   = [45000, 90000, 120000];

    function scheduleNextPost() {
      const delay = intervals[autoPostIndex % intervals.length];

      newPostTimer = setTimeout(() => {
        const postData = autoPostData[autoPostIndex % autoPostData.length];
        autoPostIndex++;

        const newPost = {
          id:           Date.now(),
          ...postData,
          timestamp:    'just now',
          hasImage:     false,
          likes:        Math.floor(Math.random() * 50),
          comments:     Math.floor(Math.random() * 10),
          shares:       Math.floor(Math.random() * 5),
          liked:        false,
          reactions:    ['⚡', '🌀'],
          reactionCount: Math.floor(Math.random() * 50),
          comments_data: []
        };

        posts.unshift(newPost);

        if (postsContainer) {
          const el = createPostCard(newPost);
          postsContainer.insertBefore(el, postsContainer.firstChild);

          if (window.gsap) {
            gsap.fromTo(el,
              { opacity: 0, y: -20, borderColor: 'var(--neon-cyan)' },
              {
                opacity:     1,
                y:           0,
                borderColor: 'var(--border-subtle)',
                duration:    0.6,
                ease:        'power3.out'
              }
            );
          }
        }

        showToast('New transmission received');
        scheduleNextPost();

      }, delay);
    }

    scheduleNextPost();
  }

  // ----------------------------------------------------------
  // SHOW TOAST
  // ----------------------------------------------------------
  function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: var(--z-toast);
      padding: 10px 20px;
      background: rgba(5, 5, 31, 0.95);
      border: 1px solid rgba(0, 245, 255, 0.3);
      border-radius: 4px;
      font-family: var(--font-mono);
      font-size: 0.7rem;
      letter-spacing: 0.1em;
      color: var(--neon-cyan);
      pointer-events: none;
      opacity: 0;
      transform: translateY(10px);
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    if (window.gsap) {
      gsap.timeline({
        onComplete: () => {
          if (toast.parentNode) toast.parentNode.removeChild(toast);
        }
      })
      .to(toast, { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' })
      .to(toast, { opacity: 0, y: -10, duration: 0.3, delay: 2, ease: 'power2.in' });
    } else {
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 2500);
    }
  }

  // ----------------------------------------------------------
  // RENDER EMPTY FEED
  // ----------------------------------------------------------
  function renderEmptyFeed() {
    if (!postsContainer) return;
    postsContainer.innerHTML = `
      <div class="empty-state">
        <span class="empty-state-icon">⬡</span>
        <span class="empty-state-title">No Transmissions</span>
        <span class="empty-state-text">The network is quiet. Be the first to broadcast.</span>
      </div>
    `;
  }

  // ----------------------------------------------------------
  // REFRESH
  // ----------------------------------------------------------
  function refresh() {
    if (!feedData) {
      loadFeedData();
    }
  }

  // ----------------------------------------------------------
  // DESTROY
  // ----------------------------------------------------------
  function destroy() {
    if (activityTimer) {
      clearInterval(activityTimer);
      activityTimer = null;
    }
    if (newPostTimer) {
      clearTimeout(newPostTimer);
      newPostTimer = null;
    }
  }

  // ----------------------------------------------------------
  // PUBLIC API
  // ----------------------------------------------------------
  return {
    init,
    refresh,
    destroy,
    showToast
  };

})();

// Auto-init
document.addEventListener('DOMContentLoaded', () => {
  AbsoluteMediaFeed.init();
});