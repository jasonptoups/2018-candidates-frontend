window.Event = new Vue()

class Filters {
  constructor () {
    this.gender = []
    this.profession = []
    this.ethnicity = []
    this.sexuality = []
  }
}

let filters = new Filters()

Vue.component('filter-bar', {
  template: `
  <aside class="menu">
    <p class="menu-label">Gender</p>
    <ul class="menu-list">
      <filter-item>Male</filter-item>
      <filter-item>Female</filter-item>
    </ul>
    <p class="menu-label">Professions</p>
    <ul class="menu-list">
      <filter-item>Educator</filter-item>
      <filter-item>Veteran</filter-item>
      <filter-item>Law</filter-item>
      <filter-item>Public Servant</filter-item>
      <filter-item>Business</filter-item>
      <filter-item>Politician</filter-item>
      <filter-item>Academic</filter-item>
      <filter-item>STEM</filter-item>
    </ul>  
    <p class="menu-label">Ethnicity</p>
      <ul class="menu-list">
      <filter-item>White</filter-item>
      <filter-item>Hispanic</filter-item>
      <filter-item>East Asian</filter-item>
      <filter-item>South Asian</filter-item>
      <filter-item>African American</filter-item>
      <filter-item>Mixed</filter-item>
    </ul>
    <p class="menu-label">Sexuality</p>
    <ul class="menu-list">
    <filter-item>LGBT</filter-item>
    <filter-item>Straight</filter-item>
  </ul>
  </aside>
  `,
  methods: {
    filterClicked (e) {
      console.log('clicked')
    }
  }
})

Vue.component('filter-item', {
  template: `
  <li><a :class="{'is-active': clicked }" @click.prevent="filterClicked"><slot></slot></a></li>
  `,
  data () {
    return {
      clicked: false
    }
  },
  methods: {
    // add to the filter object
    filterClicked (event) {
      let text = event.target.innerText
      this.isClicked()
      if (text === 'Male' || text === 'Female') {
        this.addGender(event)
      } else if (text === 'Educator' || text === 'Veteran' || text === 'Law' || text === 'Public Servant' || text === 'Business' || text === 'Politician' || text === 'Academic' || text === 'STEM' ) {
        this.addProfession(text)
      } else if (text === 'White' || text === 'Hispanic' || text === 'East Asian' || text === 'South Asian' || text === 'African American' || text === 'Mixed') {
        this.addEthnicity(text)
      } else if (text === 'LGBT' || text === 'Straight') {
        this.addSexuality(text)
      }
    },
    // toggle filter selected appearance
    isClicked (event) {
      this.clicked = !this.clicked
    },
    // see if a filter is already in an array of filters
    search (a, array) {
      return array.indexOf(a) > -1
    },
    // check if a filter is in the filter object. If it is, remove it. If not, add it.
    addGender (event) {
      this.search(event.target.innerText, filters.gender) ? _.pull(filters.gender, event.target.innerText) : filters.gender.push(event.target.innerText)
      Event.$emit('filterAdded')
    },
    addProfession (text) {
      this.search(text, filters.profession) ? _.pull(filters.profession, text) : filters.profession.push(text)
      Event.$emit('filterAdded')
    },
    addEthnicity (text) {
      this.search(text, filters.ethnicity) ? _.pull(filters.ethnicity, text) : filters.ethnicity.push(text)
      Event.$emit('filterAdded')
    },
    addSexuality (text) {
      this.search(text, filters.sexuality) ? _.pull(filters.sexuality, text) : filters.sexuality.push(text)
      Event.$emit('filterAdded')
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
    <figure class="image is-200by300 image-resize">
      <img :src="candidate.candidate.image" :alt="candidate.candidate.name">
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
      <p><span>Professions:</span> {{this.showProfessions()}}</p>
      <a :href="candidate.candidate.website">{{candidate.candidate.website}}</a> 
    </div>
    <button class="button is-primary" @click="showMore">Show More</button>
    <button class="button is-warning" @click="editCard">Edit</button>
  </div>
  </div>
  `,
  methods: {
    // Create the list of ethnicities that are True
    showEthnicity () {
      return _.keys(_.pickBy(this.ethnicities)).join(', ')
    },
    // create the list of professions that are True
    showProfessions () {
      return _.keys(_.pickBy(this.professions)).join(', ')
    },
    // launch the showMore modal
    showMore (event) {
      Event.$emit('showMore', this.candidate.candidate)
    },
    // launch the Edit modal
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
        <figure class="image is-2by3">
          <img :src="this.candidate.image" :alt="this.candidate.name">
        </figure>
      </div>
      <div class="content">
        <h1>{{this.candidate.name}}'s Bio</h1>
        <p>{{this.candidate.bio}}</p>
        <h1>Statistics</h1>
        <p>Website: <a :href="this.candidate.website">{{this.candidate.website}}</a></p>
        <p>District: {{this.candidate.state}} - {{this.candidate.district}}</p>
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
      <p class="modal-card-title">Edit {{this.candidate.name}}</p>
      <button class="delete" aria-label="close" @click="showEditModal = false"></button>
    </header>
    <section class="modal-card-body">
      <div class="card-image">
        <figure class="image is-2by3">
          <img :src="this.candidate.image" :alt="this.candidate.name">
        </figure>
      </div>
      <form>
        <label class="label">Name: </label>
        <div class="control">
          <input class="input" type="text" v-model="candidate.name">
        </div>
        <label class="label">Image Source: </label>
        <div class="control">
          <input class="input" type="text" v-model="candidate.image">
        </div>
        <label class="label">Bio: </label>
        <div class="control">
          <textarea class="textarea" v-model="candidate.bio"></textarea>
        </div>
        <label class="label">Website: </label>
        <div class="control">
          <input class="input" type="text" v-model="candidate.website">
        </div>
        <label class="label">State: </label>
        <div class="control">
          <input class="input" type="text" v-model="candidate.state">
        </div>
        <label class="label">District: </label>
        <div class="control">
          <input class="input" type="text" v-model="candidate.district">
        </div>
        <label class="label">Gender: </label>
        <div class="control">
          <input class="input" type="text" v-model="candidate.gender">
        </div>
        <label class="label">Sexuality: </label>
        <div class="control">
          <input class="input" type="text" v-model="candidate.sexuality">
        </div>
        <label class="label">Professions:</label>
          <div><span>Educator: </span><input type="checkbox" v-model="candidate.professions.Educator"></div>
          <div><span>Veteran: </span><input type="checkbox" v-model="candidate.professions.Veteran"></div>
          <div><span>Law: </span><input type="checkbox" v-model="candidate.professions.Law"></div>
          <div><span>Public Servant: </span><input type="checkbox" v-model="candidate.professions['Public Servant']"></div>
          <div><span>Politician: </span><input type="checkbox" v-model="candidate.professions.Politician"></div>
          <div><span>Business: </span><input type="checkbox" v-model="candidate.professions.Business"></div>
          <div><span>Academic: </span><input type="checkbox" v-model="candidate.professions.Academic"></div>
          <div><span>STEM: </span><input type="checkbox" v-model="candidate.professions.STEM"></div>
        <label class="label">Ethnicities:</label>
          <div><span>White: </span><input type="checkbox" v-model="candidate.ethnicities.White"></div>
          <div><span>Hispanic: </span><input type="checkbox" v-model="candidate.ethnicities.Hispanic"></div>
          <div><span>East Asian: </span><input type="checkbox" v-model="candidate.ethnicities['East Asian']"></div>
          <div><span>South Asian: </span><input type="checkbox" v-model="candidate.ethnicities['South Asian']"></div>
          <div><span>African American: </span><input type="checkbox" v-model="candidate.ethnicities['African American']"></div>
          <div><span>Mixed: </span><input type="checkbox" v-model="candidate.ethnicities.Mixed"></div>
      </form>
    </section>
    <footer class="modal-card-foot">
      <button class="button is-success" type="submit" @click="updateCandidate">Save changes</button>
      <button class="button" @click="showEditModal = false">Cancel</button>
      <button class="button is-danger" @click="deleteCandidate">Delete Candidate</button>
    </footer>
  </div>
  </div>
  `,
  data () {
    return {
      showEditModal: false,
      candidate: {},
      url: 'http://candidates-2018.herokuapp.com/api/candidates/'
    }
  },
  computed: {
    candidateURL () {
      return this.url + this.candidate._id
    }
  },
  // listen for the editCard event
  created () {
    Event.$on('editCard', candidate => {
      this.showEditModal = true
      this.candidate = candidate
    })
  },
  methods: {
    // make a PUT request to the database
    updateCandidate () {
      fetch(this.candidateURL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: this.candidate.name,
          image: this.candidate.image,
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
            'East Asian': this.candidate.ethnicities['East Asian'],
            'South Asian': this.candidate.ethnicities['South Asian'],
            'African American': this.candidate.ethnicities['African American'],
            Mixed: this.candidate.ethnicities.Mixed
          }
        })
      })
        .then(_ => {
          this.showEditModal = false
          Event.$emit('refresh')
        })
        .catch(err => {
          console.error(err)
        })
    },
    // make Delete request to the database
    deleteCandidate () {
      console.log('delete attempted')
      fetch(this.candidateURL, {
        method: 'DELETE'
      })
        .then(_ => {
          this.showEditModal = false
          Event.$emit('refresh')
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
    <label class="label">Image Source: </label>
    <div class="control">
      <input class="input" type="text" v-model="image">
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
      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>
      </p>
    </footer>
  </div>
  </div>
  `,
  data() {
    return {
      showNewModal: false,
      url: 'http://candidates-2018.herokuapp.com/api/candidates/',
      name: '',
      bio: '',
      image: 'http://',
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
      mixed: false,
      errors: []
    }
  },
  created() {
    Event.$on('newModal', _ => {
      this.showNewModal = true
      this.errors = []
    })
  },
  methods: {
    // make sure required fields are filled in
    checkForm (event) {
      if (this.name === '') this.errors.push('Name required')
      if (this.bio === '') this.errors.push('Bio required')
      if (this.state === '') this.errors.push('State required')
      if (this.district === '') this.errors.push('District required')
      if (this.gender === '') this.errors.push('Gender required')
      if (this.gender !== 'Male' || this.gender !== 'Female') this.errors.push('Please use Male or Female for gender')
      if (this.sexuality !== 'LGBT' || this.gender !== 'Straight') this.errors.push('Please use Straight or LGBT for sexuality')
    },
    // run the checkForm event and if it passes then run the post request
    addCandidate (event) {
      this.errors = []
      this.checkForm(event)
      if (this.errors !== []) return
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
            'Public Servant': this.publicservant,
            Politician: this.politician,
            Business: this.business,
            Academic: this.academic,
            STEM: this.stem
          },
          ethnicities: {
            White: this.white,
            Hispanic: this.hispanic,
            'East Asian': this.eastasian,
            'South Asian': this.southasian,
            'African American': this.africanamerican,
            Mixed: this.mixed
          }
        })
      })
        .then(_ => {
          this.showNewModal = false
          Event.$emit('refresh')
        })
    }
  }
})

var app = new Vue({
  el: '#root',
  data() {
    return {
      candidates: [],
      url: 'http://candidates-2018.herokuapp.com/api/candidates/',
      firstFilter: [],
      secondFilter: [],
      thirdFilter: [],
      fourthFilter: [],
      showAll: true
    }
  },
  // before loading, run the API get request for the first time
  mounted:
    function () {
      fetch(this.url).then(res => res.json())
        .then(res => {
          this.candidates = res
        })
    },
  created () {
    // after any changes are made, re-call the API
    Event.$on('refresh', _ => {
      fetch(this.url).then(res => res.json())
        .then(res => {
          this.candidates = res
        })
    })
    // Apply filter method is called
    Event.$on('filterAdded', _ => {
      this.applyFilter()
    })
  },
  methods: {
    newModal () {
      Event.$emit('newModal')
    },
    // This method is complex and I need help figuring out how to DRY it up. 
    // What it does is it starts with the first filter (gender). If no gender filters are selected, it outputs
    // the entire candidates array. It then passes the filter results to the firstFilter
    // the next filter starts with that firstFilter var and applies its filters on to it.
    // One tricky thing is that the first and last filters search for exact word matches
    // while the middle two filters loop through a set of keys to make sure it matches true or false.
    applyFilter () {
      filters.gender.length === 0 ? this.firstFilter = this.candidates : this.firstFilter = []
      for (let i = 0; i < filters.gender.length; i++) {
        let targetGender = filters.gender[i]
        let add = this.candidates.filter(candidate => candidate.gender === targetGender)
        this.firstFilter.push(...add)
      }
      filters.profession.length === 0 ? this.secondFilter = this.firstFilter : this.secondFilter = []
      for (let i = 0; i < filters.profession.length; i++) {
        let targetProfession = filters.profession[i]
        let add = this.firstFilter.filter(candidate => candidate.professions[targetProfession] === true)
        this.secondFilter.push(...add)
      }
      filters.ethnicity.length === 0 ? this.thirdFilter = this.secondFilter : this.thirdFilter = []
      for (let i = 0; i < filters.ethnicity.length; i++) {
        let targetEthnicity = filters.ethnicity[i]
        let add = this.secondFilter.filter(candidate => candidate.ethnicities[targetEthnicity] === true)
        this.thirdFilter.push(...add)
      }
      filters.sexuality.length === 0 ? this.fourthFilter = this.thirdFilter : this.fourthFilter = []
      for (let i = 0; i < filters.sexuality.length; i++) {
        let targetSexuality = filters.sexuality[i]
        let add = this.thirdFilter.filter(candidate => candidate.sexuality === targetSexuality)
        this.fourthFilter.push(...add)
      }
      this.fourthFilter = _.uniqWith(this.fourthFilter, _.isEqual)
      this.firstFilter.length === 0 && this.secondFilter.length === 0 && this.thirdFilter.length === 0 && this.fourthFilter.length === 0 ? this.showAll = true : this.showAll = false
    }
  }
})
