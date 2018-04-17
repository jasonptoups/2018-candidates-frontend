window.Event = new Vue()

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
      Event.$emit('applied', event.target.innerText)
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
  <div class="card" @click="cardClicked">
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
      <a :href="candidate.candidate.website">{{candidate.candidate.website}}</a> 
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
    },
    cardClicked (event) {
      Event.$emit('cardClicked', this.candidate.candidate)
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

Vue.component('modal', {
  template: `
  <div class="modal is-active" v-show="showCandidateModal">
  <div class="modal-background"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">{{this.candidate.name}}</p>
      <button class="delete" aria-label="close" @click="showCandidateModal = false"></button>
    </header>
    <section class="modal-card-body">
      <div class="card-image">
        <figure class="image is-4by3">
          <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image">
        </figure>
      </div>
      <div class="content">
        <h1>{{this.candidate.name}}'s Bio</h1>
        <p>{{this.candidate.bio}}</p>
        <h1>Statistics</h1>
        <p>Website: <a :href="this.candidate.website">{{this.candidate.website}}</a></p>
        <p>District: {{this.candidate.state}} - {{this.candidate.district}}</p>
        <p>Age: {{this.candidate.age}}</p>
        <p>Gender: {{this.candidate.gender}}</p>
        <p>Sexuality: {{this.candidate.sexuality}}</p>
        <dt>Professions</dt>
          <dd>Educator: {{this.candidate.professions.Educator}}</dd>
          <dd>Veteran: {{this.candidate.professions.Veteran}}</dd>
          <dd>Law: {{this.candidate.professions.Law}}</dd>
          <dd>Public Servant: {{this.candidate.professions['Public Servant']}}</dd>
          <dd>Politician: {{this.candidate.professions.Politician}}</dd>
          <dd>Business: {{this.candidate.professions.Business}}</dd>
        <br>
        <dt>Ethnicities</dt>
          <dd>White: {{this.candidate.ethnicities.White}}</dd>
          <dd>Hispanic: {{this.candidate.ethnicities.Hispanic}}</dd>
          <dd>East Asian: {{this.candidate.ethnicities['East Asian']}}</dd>
          <dd>South Asian: {{this.candidate.ethnicities['South Asian']}}</dd>
          <dd>African American: {{this.candidate.ethnicities['African American']}}</dd>
          <dd>Mixed: {{this.candidate.ethnicities.Mixed}}</dd>
      </div class="content">
    </section>
    <footer class="modal-card-foot">
      <button class="button is-success">Save changes</button>
      <button class="button">Cancel</button>
    </footer>
  </div>
  </div>
  `,
  data () {
    return {
      showCandidateModal: false,
      candidate: {}
    }
  },
  created () {
    Event.$on('cardClicked', candidate => {
      this.showCandidateModal = true
      this.candidate = candidate
    })
  }
})

let filter = []

var app = new Vue({
  el: '#root',
  data() {
    return {
      candidates: [],
      url: 'http://localhost:4000/api/candidates',
      genderFilters: [],
    }
  },
  beforeMount:
    function () {
      fetch(this.url).then(res => res.json())
        .then(res => {
          this.candidates = res
        })
    },
  created () {
    Event.$on('applied', $event => {
      if (filter.indexOf($event) > -1) {
        _.pull(filter, $event)
        this.genderFilter()
        console.log(filter)
      } else {
        filter.push($event)
        this.genderFilter()
        console.log(filter)
      }
    })
  },
  methods: {
    genderFilter() {
      this.genderFilters = []
      if (filter.indexOf('Male') > -1 && filter.indexOf('Female') > -1) {
        this.genderFilters.push('Male')
        this.genderFilters.push('Female')
      } else if (filter.indexOf('Male') > -1) {
        this.genderFilters.push('Male')
      } else if (filter.indexOf('Female') > -1) {
        this.genderFilters.push('Female')
      }
    }
  },
  computed: {
    maleCandidates () {
      return this.candidates.filter(candidate => candidate.gender === "Male")
    },
    genderFilteredCandidates () {
      for (let i = 0; i < this.genderFilters.length; i++) {
        return this.candidates.filter(candidate => candidate.gender === this.genderFilters[i])
      }
    },
    otherFilter () {
      return this.candidates.filter(candidate => candidate.gender === this.genderFilter[0] || candidate.gender === this.genderFilter[1])
    },
    femaleCandidates () {
      return this.candidates.filter(candidate => candidate.gender === "Female")
    },
    allCandidates () {
      return (this.femaleCandidates || this.femaleCandidates)
    }
  }
})
