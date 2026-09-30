(function () {
  const player = document.getElementById('pink-float-player');
  const closeBtn = document.getElementById('pink-float-close');

  player.addEventListener('click', function () {
    if (!player.classList.contains('expanded')) {
      player.classList.add('expanded');
    }
  });

  closeBtn.addEventListener('click', function (event) {
    event.stopPropagation();
    player.classList.remove('expanded');
  });
})();
