// script.js
$(document).ready(function () {
    // Stories data
    const stories = [
        { username: "You", avatar: "https://i.pravatar.cc/64?u=samer", live: false },
        { username: "alexrivera", avatar: "https://i.pravatar.cc/64?u=alex", live: true },
        { username: "mariaart", avatar: "https://i.pravatar.cc/64?u=maria", live: false },
        { username: "jordantravels", avatar: "https://i.pravatar.cc/64?u=jordan", live: false },
        { username: "emma.design", avatar: "https://i.pravatar.cc/64?u=emma", live: true },
        { username: "samtech", avatar: "https://i.pravatar.cc/64?u=sam", live: false }
    ];
    
    let storiesHTML = stories.map(s => `
        <div class="text-center" style="min-width: 72px;">
            <div class="position-relative mx-auto" style="width: 68px;">
                <img src="${s.avatar}" alt="${s.username}" class="rounded-circle border border-4 ${s.live ? 'border-danger' : 'border-white'}" width="68" height="68">
                ${s.live ? `<span class="position-absolute bottom-0 start-50 translate-middle-x bg-danger text-white px-1 rounded-pill small">LIVE</span>` : ''}
            </div>
            <small class="d-block mt-1 text-truncate">${s.username}</small>
        </div>
    `).join('');
    $('#storiesContainer').html(storiesHTML);
    
    // Initial posts
    let posts = [
        {
            id: 1,
            username: "alexrivera",
            avatar: "https://i.pravatar.cc/48?u=alex",
            location: "Santorini, Greece",
            caption: "Golden hour never disappoints 🌅 #TravelGram",
            image: "https://picsum.photos/id/1015/600/600",
            likes: 1248,
            liked: false,
            comments: [
                { user: "mariaart", text: "Stunning view! ✨" }
            ]
        },
        {
            id: 2,
            username: "emma.design",
            avatar: "https://i.pravatar.cc/48?u=emma",
            location: "",
            caption: "New collection just dropped! Which one is your favorite? 👟",
            image: "https://picsum.photos/id/201/600/600",
            likes: 873,
            liked: true,
            comments: []
        },
        {
            id: 3,
            username: "jordantravels",
            avatar: "https://i.pravatar.cc/48?u=jordan",
            location: "Bali, Indonesia",
            caption: "Reel drop: the most insane waterfall hike 🏞️ Watch now!",
            image: "https://picsum.photos/id/301/600/600",
            likes: 2341,
            liked: false,
            comments: [
                { user: "samtech", text: "Where is this??" }
            ]
        }
    ];
    
    // Render feed
    function renderFeed() {
        let html = '';
        posts.forEach(post => {
            html += `
            <div class="card post-card mb-4" data-id="${post.id}">
                <div class="card-header bg-white border-0 d-flex align-items-center">
                    <img src="${post.avatar}" class="rounded-circle me-3" width="36" height="36">
                    <div class="flex-grow-1">
                        <strong>${post.username}</strong>
                        ${post.location ? `<small class="d-block text-muted">${post.location}</small>` : ''}
                    </div>
                    <i class="bi bi-three-dots fs-4"></i>
                </div>
                <img src="${post.image}" class="card-img-top w-100" alt="Post" ondblclick="doubleTapLike(${post.id})">
                <div class="card-body pt-3">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <div>
                            <button onclick="toggleLike(${post.id});" class="btn btn-link text-dark p-0 fs-3 like-btn ${post.liked ? 'liked' : ''}">
                                <i class="bi ${post.liked ? 'bi-heart-fill' : 'bi-heart'}"></i>
                            </button>
                            <button onclick="return false;" class="btn btn-link text-dark p-0 fs-3 mx-2"><i class="bi bi-chat-dots"></i></button>
                            <button onclick="fakeShare()" class="btn btn-link text-dark p-0 fs-3"><i class="bi bi-send"></i></button>
                        </div>
                        <button onclick="toggleSave(${post.id});" class="btn btn-link text-dark p-0 fs-3">
                            <i class="bi bi-bookmark${post.saved ? '-fill' : ''}"></i>
                        </button>
                    </div>
                    <p class="fw-semibold mb-1">${post.likes} likes</p>
                    <p><strong>${post.username}</strong> ${post.caption}</p>
                    
                    <!-- Comments -->
                    <div id="comments-${post.id}" class="small text-muted">
                        ${post.comments.map(c => `<div><strong>${c.user}</strong> ${c.text}</div>`).join('')}
                    </div>
                    
                    <!-- Add comment -->
                    <div class="input-group mt-3">
                        <input type="text" id="comment-input-${post.id}" class="form-control border-0 bg-light" placeholder="Add a comment...">
                        <button onclick="addComment(${post.id});" class="btn btn-link text-primary">Post</button>
                    </div>
                </div>
            </div>`;
        });
        $('#feedContainer').html(html);
    }
    
    renderFeed();
    
    // Suggestions
    const suggestions = [
        { username: "travelwithme", avatar: "https://i.pravatar.cc/48?u=travel" },
        { username: "foodieheaven", avatar: "https://i.pravatar.cc/48?u=food" },
        { username: "techgeek", avatar: "https://i.pravatar.cc/48?u=tech" }
    ];
    let suggHTML = suggestions.map(s => `
        <div class="d-flex align-items-center">
            <img src="${s.avatar}" class="rounded-circle me-3" width="40" height="40">
            <div class="flex-grow-1">
                <strong>${s.username}</strong>
                <small class="d-block text-muted">Suggested for you</small>
            </div>
            <button onclick="fakeFollow(this)" class="btn btn-primary btn-sm">Follow</button>
        </div>
    `).join('');
    $('#suggestionsContainer').html(suggHTML);
    
    // Reel teaser
    const reelImages = ["https://picsum.photos/id/1016/80/80", "https://picsum.photos/id/201/80/80", "https://picsum.photos/id/301/80/80"];
    let reelHTML = reelImages.map(src => `<img src="${src}" class="rounded-3" width="80" height="80" style="object-fit:cover;">`).join('');
    $('#reelTeaser').html(reelHTML);
    
    // Global functions
    window.toggleLike = function (id) {
        const post = posts.find(p => p.id === id);
        if (!post) return;
        post.liked = !post.liked;
        if (post.liked) post.likes++; else post.likes--;
        renderFeed();
    };
    
    window.doubleTapLike = function (id) {
        const post = posts.find(p => p.id === id);
        if (!post || post.liked) return;
        post.liked = true;
        post.likes++;
        renderFeed();
        
        // Heart animation overlay
        const overlay = $(`<div class="position-absolute top-50 start-50 translate-middle text-danger" style="font-size:6rem; pointer-events:none;">❤️</div>`);
        $(`[data-id="${id}"]`).css('position','relative').append(overlay);
        overlay.addClass('heart-pop');
        setTimeout(() => overlay.remove(), 800);
    };
    
    window.addComment = function (id) {
        const input = $(`#comment-input-${id}`);
        const text = input.val().trim();
        if (!text) return;
        const post = posts.find(p => p.id === id);
        post.comments.push({ user: "samer.saeid", text });
        input.val('');
        renderFeed();
    };
    
    window.toggleSave = function (id) {
        const post = posts.find(p => p.id === id);
        if (!post) return;
        post.saved = !post.saved;
        renderFeed();
    };
    
    window.fakeShare = function () {
        alert("🔗 Post shared to your story and DMs! (demo)");
    };
    
    window.fakeFollow = function (btn) {
        $(btn).text('Following').addClass('btn-success').removeClass('btn-primary');
    };
    
    window.showCreateModal = function () {
        $('#createModal').modal('show');
    };
    
    window.fakePhotoUpload = function () {
        $('#modalPreview').html('<div class="text-success fs-1">✅ Photo selected<br><small class="text-muted">Preview ready!</small></div>');
    };
    
    window.createPost = function () {
        const caption = $('#postCaption').val().trim() || "Beautiful moment captured 📸";
        const newPost = {
            id: Date.now(),
            username: "samer.saeid",
            avatar: "https://i.pravatar.cc/48?u=samer",
            location: "",
            caption: caption,
            image: "https://picsum.photos/id/870/600/600",
            likes: 0,
            liked: false,
            comments: [],
            saved: false
        };
        posts.unshift(newPost);
        renderFeed();
        $('#createModal').modal('hide');
        $('#postCaption').val('');
        
        // Success toast
        const toast = $(`<div class="toast align-items-center text-white bg-success border-0 position-fixed bottom-0 end-0 m-3" style="z-index:9999"><div class="d-flex"><div class="toast-body">✅ Post shared to Instagram!</div><button class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div></div>`);
        $('body').append(toast);
        new bootstrap.Toast(toast[0]).show();
        setTimeout(() => toast.remove(), 3500);
    };
    
    window.fakeSearch = function (e) {
        e.preventDefault();
        const q = $('#searchInput').val().trim();
        if (q) alert(`🔍 Searching Instagram for "${q}"\n\n(Results would show posts, reels, accounts & hashtags)`);
        $('#searchInput').val('');
    };
    
    window.fakeLogout = function (e) {
        e.preventDefault();
        if (confirm("Log out of this Instagram clone demo?")) location.reload();
    };
    
    console.log('%c✅ Instagram Web Clone ready! Built with ❤️ by SAMER SAEID', 'color:#e1306c;font-weight:bold;font-size:14px');
});
