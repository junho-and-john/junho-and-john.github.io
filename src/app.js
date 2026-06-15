(function () {
  const { useEffect, useState } = React;
  const posters = window.POSTERS || [];

  function getPosterIdFromLocation() {
    const hashId = decodeURIComponent(window.location.hash.replace(/^#/, ""));
    if (hashId) {
      return hashId;
    }

    return decodeURIComponent(window.location.pathname.replace(/^\/|\/$/g, ""));
  }

  function getPosterFromHash() {
    const id = getPosterIdFromLocation();
    return posters.find((poster) => poster.id === id) || posters[0];
  }

  function App() {
    const [activePoster, setActivePoster] = useState(getPosterFromHash);
    const activeImages = activePoster ? activePoster.images || [] : [];
    const listMeta = (poster) =>
      `${poster.award || "참가"} · ${poster.awardDate}`;

    useEffect(() => {
      function syncFromHash() {
        setActivePoster(getPosterFromHash());
      }

      window.addEventListener("hashchange", syncFromHash);
      return () => window.removeEventListener("hashchange", syncFromHash);
    }, []);

    function selectPoster(poster) {
      setActivePoster(poster);
      window.history.replaceState(null, "", `/${encodeURIComponent(poster.id)}/`);
    }

    if (!activePoster) {
      return React.createElement(
        "main",
        { className: "empty-state" },
        React.createElement("h1", null, "Kim Jun Ho"),
      );
    }

    return React.createElement(
      "main",
      { className: "app-shell" },
      React.createElement(
        "header",
        { className: "site-header" },
        React.createElement(
          "div",
          null,
          React.createElement("h1", null, "Kim Jun Ho"),
        ),
      ),
      React.createElement(
        "section",
        { className: "workspace", "aria-label": "포스터 게시물" },
        React.createElement(
          "aside",
          { className: "poster-list", "aria-label": "게시물 목록" },
          posters.map((poster, index) =>
            React.createElement(
              "button",
              {
                key: poster.id,
                className:
                  "poster-item" + (poster.id === activePoster.id ? " is-active" : ""),
                type: "button",
                onClick: () => selectPoster(poster),
                "aria-pressed": poster.id === activePoster.id,
              },
              React.createElement("img", {
                src: poster.images[0].src,
                width: poster.images[0].width,
                height: poster.images[0].height,
                alt: "",
                loading: index === 0 ? "eager" : "lazy",
              }),
              React.createElement(
                "span",
                { className: "poster-item-copy" },
                React.createElement("strong", null, poster.title),
                React.createElement("span", null, listMeta(poster)),
              ),
            ),
          ),
        ),
        React.createElement(
          "article",
          { className: "poster-viewer" },
          React.createElement(
            "div",
            { className: "poster-meta" },
            React.createElement(
              "div",
              { className: "post-heading" },
              React.createElement("h2", null, activePoster.title),
              React.createElement(
                "dl",
                { className: "post-details" },
                React.createElement("div", null, React.createElement("dt", null, "주관"), React.createElement("dd", null, activePoster.organizer)),
                activePoster.award
                  ? React.createElement("div", null, React.createElement("dt", null, "상훈"), React.createElement("dd", null, `${activePoster.award} (${activePoster.awardTitle})`))
                  : null,
                React.createElement("div", null, React.createElement("dt", null, activePoster.dateLabel || "수상일"), React.createElement("dd", null, activePoster.awardDate)),
              ),
            ),
          ),
          React.createElement(
            "div",
            { className: "poster-stack" },
            activeImages.map((image, index) =>
              React.createElement("img", {
                key: image.src,
                className: "poster-image",
                src: image.src,
                width: image.width,
                height: image.height,
                alt: image.alt,
                loading: index === 0 ? "eager" : "lazy",
              }),
            ),
          ),
        ),
      ),
    );
  }

  ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(App));
})();
