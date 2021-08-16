<template>
  <focus-area-double>
    <p>There are a lot of experiences we have all grown to miss over the last year and a half. After hearing from our
      community, two of the top experiences they miss are collaborating with peers, and getting Cloudflare swag. Perhaps
      even in the reverse order! In-person events like conferences were once a key channel to satisfy both these
      interests, however today’s remote world makes that much harder. But does it have to?

      Today, we are excited to introduce the Cloudflare Developer Summer Challenge. We will be rewarding 300
      participants
      with boxes of our most popular swag, while enabling collaboration with other participants through our Workers
      Discord channel.

      To participate, you have to build a project that uses Cloudflare Workers and at least one other product in our
      rapidly expanding developer platform. We will judge submissions and award swag boxes to those with the most
      innovative projects, limited to one box per person. The Challenge will be open for submissions between today, and
      closing November 1, 2021. See a full list of terms and conditions here.
      What are the details?

      Cloudflare’s developer platform offers all the building blocks to create end-to-end applications with products
      across compute, storage, and frontend services. To successfully participate in the Cloudflare Developer Summer
      Challenge, you need to build a project with at least two of the following products in the Cloudflare developer
      platform. Bonus points for using more! These products include:

      Cloudflare Workers: an edge-based serverless computing platform where you can deploy code automatically worldwide,
      with speed, security, and scale baked in.
      Workers KV: a global low-latency key value data store for exceptionally high read volumes, making it possible to
      build highly dynamic APIs and websites which respond as quickly as a cached static file would.
      Durable Objects: a storage platform providing low-latency coordination and consistent storage at the edge,
      enabling
      stateful serverless use cases.
      Cloudflare Pages: a Jamstack web development platform to collaborate on and deploy high performance sites quickly
      across the world.

      How will submissions be judged?

      Submissions will be based on three criteria:

      The first criteria is to meet the basic requirements of the challenge. This includes using at least two products
      in
      the platform, and submitting the live link of your project and your code repository. You must submit before
      November
      1, 2021.
      The second criteria we will judge is around innovation. Projects that are unique and useful to users will be more
      likely to win the swag boxes.
      The third criteria is based on the breadth of the Cloudflare platform you use. The more products you integrate,
      the
      better!

      How do I participate?

      Step 1: Get Started: You can get started with the developer platform by visiting the Cloudflare Workers Quickstart
      Guide, and reviewing the Workers KV and/or Durable Objects documentation. To host your frontend site on Cloudflare
      Pages, you can visit the Pages Quickstart Guide.

      Step 2: Build your Project: If you would like inspiration, you can view our tutorials, and examples. You can also
      view our Built With Workers page. If you want to try and build something more advanced, you can see some
      additional
      examples below.

      Step 3: Share your Project: Successful submission includes a link to your live project, and a link to your code
      repository. We also encourage you to share your work, or pictures of you unboxing/ using your swag by tagging
      @CloudflareDev on Twitter with the hashtag #CloudflareSummerChallenge.

      Optional: Engage with the Community To promote collaboration and interaction with peers, we will have a dedicated
      channel in the Cloudflare Workers Discord server. For those who want to, you can learn what others are building,
      share your project, or join Q&A sessions if you have questions or need help getting started. You can also meet
      developers participating around the world.
      What are examples of advanced projects I can build?

      The Cloudflare developer platform is ideal for a wide range of use cases – from augmenting existing applications
      to
      building entirely new ones without needing to maintain underlying infrastructure. Essentially, you write the code,
      and we handle the rest. Running on the Cloudflare edge network, applications scale automatically and run worldwide
      within seconds of users.
      Build a Serverless API for your Frontend

      Cloudflare Workers’ high performance and edge network make it well-suited for building APIs. It is also a great
      companion to your frontend applications on Cloudflare Pages. You can use Workers as the backend, and build your
      frontend with frameworks such as React, Gatsby, Hugo, Svelte, and more — and then deploy your site onto Pages.

      You can easily begin building a serverless API for your frontend by creating a new Workers project with the
      Wrangler
      CLI:

      ‘wrangler generate serverless-api https://github.com/cloudflare/worker-typescript-template’

      To complete this type of project, you can follow the rest of the steps outlined in our Pages documentation.
      Build an Interactive Game

      Combining Cloudflare Workers, Durable Objects, and WebSockets makes a powerful platform for managing state at the
      edge. Running on Cloudflare’s global network enables exceptionally low latency, so users can interact instantly
      worldwide. Examples of interactive applications can range from chat rooms to multiplayer video games.

      To build interactive video games, you can integrate with popular tools such as Unity and WebGL using an
      authoritative client model (we have an example of how to achieve this). You do not even need expertise in building
      video games. Following this example above, the client can run a compiled game directly in the browser with
      WebAssembly. The server, running on Cloudflare Workers, can be interacted with via WebSockets, and uses Durable
      Objects to manage game state.</p>

    <p v-intersect="onRightIntersect" class="float-right">&nbsp;</p>
    <v-overlay :value="loading">
      <v-progress-circular
          indeterminate
          size="64"
      ></v-progress-circular>
    </v-overlay>
    <v-fab-transition>
      <v-btn fab elevation="2" fixed left bottom dark color="primary" @click.stop="moreActionsDialogOpen=true">
        <v-progress-circular indeterminate v-show="tinyLoading"></v-progress-circular>
        <v-icon v-show="!tinyLoading">mdi-plus</v-icon>
      </v-btn>
    </v-fab-transition>
    <v-dialog v-model="moreActionsDialogOpen">
      <v-card>
        <v-card-title>更多操作</v-card-title>
        <v-btn icon absolute right top @click="moreActionsDialogOpen=false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-card-text>
          <v-btn @click="navigateToNovel">
            <v-icon>mdi-arrow-left</v-icon>
            退出
          </v-btn>
          <novel-toc-table :toc="toc" :per-page="10"></novel-toc-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </focus-area-double>
</template>

<script>
import FocusAreaDouble from "@/components/FocusAreaDouble"
import NovelTocTable from "@/components/NovelTocTable"

export default {
  name: "Read",
  components: {NovelTocTable, FocusAreaDouble},
  props: {
    novelId: [Number, String],
    viewType: String,// normal, fallback
    rawOrderId: [Number, String]
  },
  data() {
    return {
      isRightIntersecting: false,
      novelInfo: null,
      loading: true,
      tinyLoading: false,
      moreActionsDialogOpen: false,
      fetchedOrderIdBegin: this.orderId,
      fetchedOrderIdEnd: this.orderId,
      content: ''
    }
  },
  watch: {
    novelId() {
      this.getNovelInfo()
    }
  },
  computed: {
    orderId() {
      return parseInt(this.rawOrderId)
    },
    toc() {
      return this.novelInfo?.toc || []
    },
    useFallback() {
      return this.viewType === 'fallback'
    }
  },
  mounted() {
    this.getNovelInfo()
  },
  methods: {
    onRightIntersect(entries, observer) {
      this.isRightIntersecting = entries[0].isIntersecting
      console.log('Right Intersecting: ' + this.isRightIntersecting)
    },
    getNovelInfo() {
      this.loading = true
      this.$axios.get('novel/' + this.novelId + (this.useFallback ? '?fallback=1' : '')).then(res => {
        this.novelInfo = res.data.data
        this.loading = false
      })
    },
    navigateToNovel() {
      this.$router.push({name: 'Novel', params: {novelId: this.novelId}})
    },
    getChapter(orderId) {
      this.tinyLoading=true
      // this.$axios.get('')
    }
  },
  metaInfo: {
    title: '阅读'
  },
}
</script>

<style scoped>

</style>
