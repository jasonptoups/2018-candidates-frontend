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
      <a :href="candidate.candidate.website">{{candidate.candidate.website}}</a> 
    </div>
    <button class="button is-primary" @click="showMore">Show More</button>
    <button class="button is-warning" @click="editCard">Edit</button>
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
    showMore (event) {
      Event.$emit('showMore', this.candidate.candidate)
    },
    editCard () {
      Event.$emit('editCard', this.candidate.candidate)
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

Vue.component('more-modal', {
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
    Event.$on('showMore', candidate => {
      this.showCandidateModal = true
      this.candidate = candidate
    })
  }
})

Vue.component('edit-modal', {
  template: `
  <div class="modal is-active" v-show="showEditModal">
  <div class="modal-background"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">{{this.candidate.name}}</p>
      <button class="delete" aria-label="close" @click="showEditModal = false"></button>
    </header>
    <section class="modal-card-body">
      <div class="card-image">
        <figure class="image is-4by3">
          <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image">
        </figure>
      </div>
      <form>
        <label class="label">Name: </label>
        <div class="control">
          <input class="input" type="text" v-model="this.candidate.name">
        </div>
        <label class="label">Bio: </label>
        <div class="control">
          <textarea class="textarea" v-model="this.candidate.bio"></textarea>
        </div>
        <label class="label">Website: </label>
        <div class="control">
          <input class="input" type="text" v-model="this.candidate.website">
        </div>
        <label class="label">State: </label>
        <div class="control">
          <input class="input" type="text" v-model="this.candidate.state">
        </div>
        <label class="label">District: </label>
        <div class="control">
          <input class="input" type="text" v-model="this.candidate.district">
        </div>
        <label class="label">Age: </label>
        <div class="control">
          <input class="input" type="text" v-model="this.candidate.age">
        </div>
        <label class="label">Gender: </label>
        <div class="control">
          <input class="input" type="text" v-model="this.candidate.gender">
        </div>
        <label class="label">Sexuality: </label>
        <div class="control">
          <input class="input" type="text" v-model="this.candidate.sexuality">
        </div>
        <label class="label">Professions:</label>
          <div><span>Educator: </span><input type="checkbox" v-model="this.candidate.professions.Educator"></div>
          <div><span>Veteran: </span><input type="checkbox" v-model="this.candidate.professions.Veteran"></div>
          <div><span>Law: </span><input type="checkbox" v-model="this.candidate.professions.Law"></div>
          <div><span>Public Servant: </span><input type="checkbox" v-model="this.candidate.professions['Public Servant']"></div>
          <div><span>Politician: </span><input type="checkbox" v-model="this.candidate.professions.Politician"></div>
          <div><span>Business: </span><input type="checkbox" v-model="this.candidate.professions.Business"></div>
          <div><span>Academic: </span><input type="checkbox" v-model="this.candidate.professions.Academic"></div>
          <div><span>STEM: </span><input type="checkbox" v-model="this.candidate.professions.STEM"></div>
        <label class="label">Ethnicities:</label>
          <div><span>White: </span><input type="checkbox" v-model="this.candidate.ethnicities.White"></div>
          <div><span>Hispanic: </span><input type="checkbox" v-model="this.candidate.ethnicities.Hispanic"></div>
          <div><span>East Asian: </span><input type="checkbox" v-model="this.candidate.ethnicities['East Asian']"></div>
          <div><span>South Asian: </span><input type="checkbox" v-model="this.candidate.ethnicities['South Asian']"></div>
          <div><span>African American: </span><input type="checkbox" v-model="this.candidate.ethnicities['African American']"></div>
          <div><span>Mixed: </span><input type="checkbox" v-model="this.candidate.ethnicities.Mixed"></div>
      </form>
    </section>
    <footer class="modal-card-foot">
      <button class="button is-success" @click="updateCandidate()">Save changes</button>
      <button class="button">Cancel</button>
      <button class="button is-danger" @click="deleteCandidate">Delete Candidate</button>
    </footer>
  </div>
  </div>
  `,
  data () {
    return {
      showEditModal: false,
      candidate: {},
      url: 'http://localhost:4000/api/candidates/',
    }
  },
  computed: {
    candidateURL() {
      return this.url + this.candidate._id
    }
  },
  created () {
    Event.$on('editCard', candidate => {
      this.showEditModal = true
      this.candidate = candidate
    })
  },
  methods: {
    updateCandidate () {
      fetch(this.candidateURL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: this.candidate.name,
          state: this.candidate.state,
          district: this.candidate.district,
          age: this.candidate.age,
          gender: this.candidate.gender,
          sexuality: this.candidate.sexuality,
          website: this.candidate.website,
          bio: this.candidate.bio,
          professions: {
            Educator: this.candidate.professions.Educator,
            Veteran: this.candidate.professions.Veteran,
            Law: this.candidate.professions.Law,
            'Public Servant': this.candidate.professions['Public Servant'],
            Politician: this.candidate.professions.Politician,
            Academic: this.candidate.professions.Academic,
            STEM: this.candidate.professions.STEM
          },
          ethnicities: {
            White: this.candidate.ethnicities.White,
            Hispanic: this.candidate.ethnicities.Hispanic,
            "East Asian": this.candidate.ethnicities['East Asian'],
            "South Asian": this.candidate.ethnicities['South Asian'],
            "African American": this.candidate.ethnicities['African American'],
            Mixed: this.candidate.ethnicities.Mixed
          }
        })
      })
        .then(a => {
          console.log(a)
        })
        .catch(err => {
          console.error(err)
        })
    },
    deleteCandidate () {
      console.log('delete attempted')
      fetch(this.candidateURL, {
        method: 'DELETE'
      })
    }
  }
})

Vue.component('new-modal', {
  template: `
  <div class="modal is-active" v-show="showNewModal">
  <div class="modal-background"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">New Candidate</p>
      <button class="delete" aria-label="close" @click="showNewModal = false"></button>
    </header>
    <section class="modal-card-body">
    <label class="label">Name:</label>
    <div class="control">
      <input class="input" type="text" v-model="name">
    </div>
    <label class="label">Bio: </label>
    <div class="control">
      <textarea class="textarea" v-model="bio"></textarea>
    </div>
    <label class="label">Website: </label>
    <div class="control">
      <input class="input" type="text" v-model="website">
    </div>
    <label class="label">State: </label>
    <div class="control">
      <input class="input" type="text" v-model="state">
    </div>
    <label class="label">District: </label>
    <div class="control">
      <input class="input" type="text" v-model="district">
    </div>
    <label class="label">Age: </label>
    <div class="control">
      <input class="input" type="text" v-model="age">
    </div>
    <label class="label">Gender: </label>
    <div class="control">
      <input class="input" type="text" v-model="gender">
    </div>
    <label class="label">Sexuality: </label>
    <div class="control">
      <input class="input" type="text" v-model="sexuality">
    </div>
    <label class="label">Professions:</label>
    <div><span>Educator: </span><input type="checkbox" v-model="educator"></div>
    <div><span>Veteran: </span><input type="checkbox" v-model="veteran"></div>
    <div><span>Law: </span><input type="checkbox" v-model="law"></div>
    <div><span>Public Servant: </span><input type="checkbox" v-model="publicservant"></div>
    <div><span>Politician: </span><input type="checkbox" v-model="politician"></div>
    <div><span>Business: </span><input type="checkbox" v-model="business"></div>
    <div><span>Academic: </span><input type="checkbox" v-model="academic"></div>
    <div><span>STEM: </span><input type="checkbox" v-model="stem"></div>
  <label class="label">Ethnicities:</label>
    <div><span>White: </span><input type="checkbox" v-model="white"></div>
    <div><span>Hispanic: </span><input type="checkbox" v-model="hispanic"></div>
    <div><span>East Asian: </span><input type="checkbox" v-model="eastasian"></div>
    <div><span>South Asian: </span><input type="checkbox" v-model="southasian"></div>
    <div><span>African American: </span><input type="checkbox" v-model="africanamerican"></div>
    <div><span>Mixed: </span><input type="checkbox" v-model="mixed"></div>

    </section>
    <footer class="modal-card-foot">
      <button class="button is-success" type="submit" @click="addCandidate">Save changes</button>
    </footer>
  </div>
  </div>
  `,
  data() {
    return {
      showNewModal: false,
      url: 'http://localhost:4000/api/candidates/',
      name: '',
      bio: '',
      website: 'http://',
      state: '',
      district: '',
      age: 0,
      gender: '',
      sexuality: '',
      educator: false,
      veteran: false,
      law: false,
      publicservant: false,
      politician: false,
      business: false,
      academic: false,
      stem: false,
      white: false,
      hispanic: false,
      eastasian: false,
      southasian: false,
      africanamerican: false,
      mixed: false
    }
  },
  created() {
    Event.$on('newModal', _ => {
      this.showNewModal = true
    })
  },
  methods: {
    addCandidate (event) {
      console.log(this.name)
      fetch(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: this.name,
          bio: this.bio,
          website: this.website,
          state: this.state,
          district: this.district,
          age: this.age,
          gender: this.gender,
          sexuality: this.sexuality,
          professions: {
            Educator: this.educator,
            Veteran: this.veteran,
            Law: this.law,
            "Public Servant": this.publicservant,
            Politician: this.politician,
            Business: this.business,
            Academic: this.academic,
            STEM: this.stem
          },
          ethnicities: {
            White: this.white,
            Hispanic: this.hispanic,
            "East Asian": this.eastasian,
            "South Asian": this.southasian,
            "African American": this.africanamerican,
            Mixed: this.mixed
          }
        })
      })
        .then(res => {
          console.log(res)
          this.showNewModal = false
        })
    }
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
    },
    newModal () {
      Event.$emit('newModal')
    },
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


