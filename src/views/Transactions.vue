<template>
  <div v-show="user" class="container-fluid">
    <h1 class="pt-4 px-5">Track Your Transactions</h1>
    <h4 class="text-center">
      Budget: ${{totalIncome}}, Total Transactions: ${{totalTransactions}}.
      <span
        v-bind:class="{ incomeColor: budgetSummary() >= 0, 
                dangerColor: budgetSummary() < 0}"
      >{{summaryString}}</span>
    </h4>
    <div class="table-responsive mt-5">
      <table id="table" class="table table-hover text-center">
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Amount</th>
            <th scope="col">Description</th>
            <th scope="col">Category</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody id="tBody">
          <tr v-for="transaction in transactions" v-bind:key="transaction._id">
            <td>{{transaction.date}}</td>
            <td>${{transaction.amount}}</td>
            <td>{{transaction.description}}</td>
            <td>{{transaction.category}}</td>
            <td>
              <button type="button" class="btn btn-info mr-1" v-on:click="edit(transaction)">Edit</button>
              <button
                type="button"
                class="btn btn-danger"
                v-on:click="deleteTransaction(transaction)"
              >Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="container my-3">
      <div class="row">
        <button
          id="button"
          v-if="showButton"
          v-on:click="onClickNewTransaction"
          type="button"
          class="btn bg-prim center"
        >
          New
          Transaction
        </button>
        <form
          v-if="showCreateForm"
          class="m-auto"
          id="form"
          v-on:submit.prevent="createTransaction"
        >
          <input v-model="addedDate" placeholder="Date MM-DD">
          <input v-model="addedAmount" placeholder="Amount">
          <input v-model="addedDescription" placeholder="Description">
          <select v-model="addedCategory" placeholder="Category">
            <option v-bind:key="category._id" v-for="category in categories">{{category.title}}</option>
          </select>
          <button type="submit">Submit</button>
        </form>
        <form
          v-if="showEditForm"
          class="m-auto"
          id="editForm"
          v-on:submit.prevent="updateTransaction"
        >
          <input v-model="editTransactionDate" placeholder="Date MM-DD">
          <input v-model="editTransactionAmount" placeholder="Amount">
          <input v-model="editDescription" placeholder="Description">
          <select v-model="editCategory" placeholder="Category">
            <option v-bind:key="category._id" v-for="category in categories">{{category.title}}</option>
          </select>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      addedDate: "",
      addedAmount: "",
      addedDescription: "",
      addedCategory: "",
      budget: 0,
      editTransactionDate: "",
      editTransactionAmount: "",
      editCategory: "",
      editDescription: "",
      editTransactionId: "",
      showCreateForm: false,
      showEditForm: false,
      showButton: true
    };
  },
  async created() {
    await this.getTransactions();
    await this.calculateBudget();
    await this.getCategories();
  },
  computed: {
    summaryString() {
      const res = this.budgetSummary();
      return (
        "You are $" +
        Math.abs(res) +
        (res < 0 ? " over " : " under ") +
        " budget!"
      );
    },
    totalTransactions() {
      return this.$store.state.totalExpenses;
    },
    totalIncome() {
      return this.$store.state.totalIncome;
    },
    transactions() {
      return this.$store.state.transactions;
    },
    categories() {
      return this.$store.state.categories;
    },
    user() {
      return this.$store.state.user;
    },
  },

  methods: {
    async getTransactions() {
      try {
        const response = await this.$store.dispatch("getTransactions");
        return true;
      } catch (error) {
        console.log(error);
      }
    },

    budgetSummary() {
      return (this.$store.state.totalIncome - this.$store.state.totalExpenses).toFixed(2);
    },

    onClickNewTransaction() {
      this.showButton = false;
      this.showCreateForm = true;
    },

    async createTransaction() {
      if (this.addedAmount[0] === "$") {
        this.addedAmount = this.addedAmount.substr(1);
      }
      try {
        await this.$store.dispatch("createTransaction", {
          date: this.addedDate,
          amount: this.addedAmount,
          description: this.addedDescription,
          category: this.addedCategory
        });
        this.addedDate = "";
        this.addedAmount = "";
        this.addedDescription = "";
        this.addedCategory = "";
        this.showButton = true;
        this.showEditForm = false;
        this.showCreateForm = false;
        this.getTransactions();
      } catch (error) {
        console.log(error);
      }
    },
    async deleteTransaction(transaction) {
      try {
        const response = await this.$store.dispatch(
          "deleteTransaction",
          transaction._id
        );
        this.getTransactions();
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async calculateBudget() {
      try {
        await this.$store.dispatch('getIncomes');
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async updateTransaction() {
      try {
        const response = await this.$store.dispatch("updateTransaction", {
          id: this.editTransactionId,
          date: this.editTransactionDate,
          amount: this.editTransactionAmount,
          description: this.editDescription,
          category: this.editCategory
        });
        this.getTransactions();
        this.showButton = true;
        this.showCreateForm = false;
        this.showEditForm = false;
      } catch (error) {
        console.log(error);
      }
    },
    edit(transaction) {
      this.editTransactionDate = transaction.date;
      this.editTransactionAmount = transaction.amount;
      this.editDescription = transaction.description;
      this.editCategory = transaction.category;
      this.editTransactionId = transaction._id;
      this.showEditForm = true;
      this.showCreateForm = false;
      this.showButton = false;
    },

    async getCategories() {
      try {
        let result = await this.$store.dispatch("getCategories");
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>


<style>
</style>
