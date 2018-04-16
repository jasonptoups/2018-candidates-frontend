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
  <li><a :class="{'is-active': clicked }" @click.prevent="isClicked">
    <slot></slot>
  </a></li>
  `,
  data () {
    return {
      clicked: false
    }
  },
  methods: {
    isClicked: function (event) {
      this.clicked = !this.clicked
    }
  }
})

Vue.component('candidate-card', {
  props: {
    candidate: {
      type: Object
    }
  },
  template: `
  <div class="card">
  <div class="card-image">
    <figure class="image is-4by3">
      <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image">
    </figure>
  </div>
  <div class="card-content">
    <div class="media">
      <div class="media-content">
        <p class="title is-4">{{candidate.candidate.name}} ({{candidate.candidate.state}}-{{candidate.candidate.district}})</p>
      </div>
    </div>
    <div class="content">
      <p><span>Gender:</span> {{candidate.candidate.gender}}</p>
      <p><span>Ethnicity:</span> {{this.showEthnicity()}}</p>
      <p><span>Sexuality:</span> {{candidate.candidate.sexuality}}</p>
      <p><span>Professions:</span> {{this.showProfessions()}}</p>
      <a href="#">Website</a> 
    </div>
  </div>
  </div>
  `,
  methods: {
    showEthnicity () {
      return _.keys(_.pickBy(this.ethnicities)).toString()
    },
    showProfessions () {
      return _.keys(_.pickBy(this.professions)).toString()
    }
  },
  computed: {
    ethnicities () {
      return this.candidate.candidate.ethnicities
    },
    professions () {
      return this.candidate.candidate.professions
    }
  }
})

var app = new Vue({
  el: '#root',
  data() {
    return {
      candidates: [],
      url: 'http://localhost:4000/api/candidates'
    }
  },
  beforeMount:
    function () {
      fetch(this.url).then(res => res.json())
        .then(res => {
          this.candidates = res
        })
    }
})
