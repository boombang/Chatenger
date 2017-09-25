import "./styles.css";

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tabs');
  [].forEach.call(document.querySelectorAll('.tab-trigger'), function (tabTrigger) {
    tabTrigger.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector('.tab_hidden').classList.remove('tab_hidden');
      this.parentNode.classList.add('tab_hidden');
    });
  });
});
