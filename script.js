Vue.component('filter-bar', {
  template: `
  <aside class="menu">
  <filter-header>Gender</filter-header>
    <ul class="menu-list">
      <filter-item>Male</filter-item>
      <filter-item>Female</filter-item>
    </ul>
  <filter-header>Ethnicity</filter-header>
    <ul class="menu-list">
      <filter-item>White</filter-item>
      <filter-item>Hispanic</filter-item>
      <filter-item>East Asian / Pacific Islander</filter-item>
      <filter-item>South Asian</filter-item>
      <filter-item>African American</filter-item>
      <filter-item>Mixed</filter-item>
    </ul>
  <filter-header>Sexuality</filter-header>
  <ul class="menu-list">
    <filter-item>Gay</filter-item>
    <filter-item>Straight</filter-item>
  </ul>
  <filter-header>Professions</filter-header>
  <ul class="menu-list">
    <filter-item>Educator</filter-item>
    <filter-item>Veteran</filter-item>
    <filter-item>Politician</filter-item>
    <filter-item>Public Servant</filter-item>
    <filter-item>Business</filter-item>
    <filter-item>Experienced Politician</filter-item>
    <filter-item>Academics</filter-item>
    <filter-item>STEM</filter-item>
  </ul>
  <filter-header>Appearance</filter-header>
    <ul class="menu-list">
    <filter-item>Hot</filter-item>
    <filter-item>Not</filter-item>
    </ul>
  </aside>
  `
})

Vue.component('filter-header', {
  template: `
  <p class="menu-label">
    <slot></slot>
  </p>
  `
})

Vue.component('filter-item', {
  template: `
  <li><a :class="{'is-active': clicked }" @click.prevent="clicked = !clicked">
    <slot></slot>
  </a></li>
  `,
  data () {
    return {
      clicked: false
    }
  }
})

var app = new Vue({
  el: '#root'
})
