import { html, css, LitElement } from "lit";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getDatabase,
  ref,
  child,
  push,
  onValue,
  update,
  get,
  set,
  remove,
} from "firebase/database";
import { signOut, onAuthStateChanged } from "firebase/auth";

import firebaseConfig from "./firebaseConfig";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase();
const dbref = ref(db);

let widgetKey = "";
let dataKey;
let dashboardId = ``;

class MyDashboard extends LitElement {
  static properties = {
    dataList: { type: Object },
    isFormOpen: { type: Boolean },
    isOpenForm: { type: Boolean },
    isEditDialogOpen: { type: Boolean },
    isAddDataDialogOpen: { type: Boolean },
    selectedTitle: { type: String },
    updatedLabelInput: { type: String },
    updatedContentInput: { type: String },
    updatedCommentInput: { type: String },
    isAddCommentDialogOpen: { type: Boolean },
    isCommentPresent: { type: Boolean },

  };

  static styles = css`
    .widget {
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 10px;
      margin: 10px;
      background-color: #f7f7f7;
    }
    .content {
      /* margin-top: 5px;
  padding: 5px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px; */
      cursor: pointer;
    }

    .content:hover {
      background-color: #d1cdcd;
    }
    .footer {
      /* margin-top: 5px;
  padding: 5px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-style: italic; */
      cursor: pointer;
    }

    .footer:hover {
      background-color: #e0e0e0;
    }

    .listText:hover {
      text-decoration: underline;
      cursor: pointer;
    }
    
  
    .list li {
      list-style: none;
    }

    .open-button {
      padding: 8px 8px;
      /* position: fixed; */
      background-color: #c1b3b3;
      /* bottom: 20px;
      right: 20px; */
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .open-button:hover {
      background-color: green;
      color: white;
    }

    #head {
      position: fixed;
      top: 15px;
      right: 20px;
    }
    .form-dialog {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 400px;
      padding: 20px;
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 4px;
      /* box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); */
      box-shadow: rgba(0, 0, 0, 0.2) 0px 20px 9px 0px;
    }

    .form-dialog label {
      display: block;
      margin-bottom: 10px;
    }

    .form-dialog input[type="text"] {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    .form-dialog button {
      padding: 8px 16px;
      /* background-color: #4caf50; */
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .form-dialog .button-group {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    }
    .form-dialog #add_Data {
      background-color: green;
    }
    .form-dialog #btn_cancel {
      background-color: rgb(233 55 55);
    }

    .form-dialog2 {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 400px;
      padding: 20px;
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 4px;
      /* box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); */
      box-shadow: rgba(0, 0, 0, 0.2) 0px 20px 9px 0px;
    }

    .form-dialog2 label {
      display: block;
      margin-bottom: 10px;
    }
    .form-dialog2 input[type="text"] {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    .form-dialog2 button {
      padding: 8px 16px;
      /* background-color: #4caf50; */
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .form-dialog2 .button-group {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    }

    .form-dialog2 .cancel {
      position: absolute;
      top: 10px;
      right: 10px;
      /* background-color: rgb(233 55 55); */
      color: black;
      padding: 4px 7px;
    }

    .form-dialog2 .cancel:hover {
      background-color: #f03434;
      color: white;
    }

    .form-dialog2 .cancel-button {
      background-color: rgb(233 55 55);
    }

    .form-dialog2 #updtBtn {
      background-color: green;
    }

    #myForm3 {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 400px;
      padding: 20px;
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 4px;
      /* box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); */
      box-shadow: rgba(0, 0, 0, 0.2) 0px 20px 9px 0px;
    }

    .form-dialog3 label {
      display: block;
      margin-bottom: 10px;
    }
    .form-dialog3 input[type="text"] {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .form-dialog3 button {
      padding: 8px 16px;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .form-dialog3 .button-group {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    }

    .form-dialog3 .cancel {
      position: absolute;
      top: 10px;
      right: 10px;
      /* background-color: rgb(233 55 55); */
      color: black;
      padding: 4px 7px;
    }
    .form-dialog3 .cancel:hover {
      background-color: #f03434;
      color: white;
    }
    .form-dialog3 .cancel-button {
      background-color: rgb(233 55 55);
    }

    .form-dialog3 #addData {
      background-color: green;
    }
    #editTitle {
      background-color: green;
      margin-left: 10px;
      flex-shrink: 0; //Preventing the update button from shrinking
    }
    #updatedTitleInput {
      flex-grow: 1;
    }

    #titleEditDivLabel {
      width: 100%;
    }
    #titleEditDivInBtn {
      display: flex;
    }

    #commentDivLabel {
      width: 100%;
    }
    #commentDivInBtn {
      display: flex;
    }
    .form-dialog4 {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 400px;
      padding: 20px;
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 4px;
      /* box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); */
      box-shadow: rgba(0, 0, 0, 0.2) 0px 20px 9px 0px;
    }

    /* .form-dialog4 label {
        display: block;
        margin-bottom: 10px;
      } */
    .form-dialog4 input[type="text"] {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    .form-dialog4 button {
      /* margin-top: 10px; */
      padding: 8px 16px;
      /* background-color: #4caf50; */
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .form-dialog4 .button-group {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    }

    .form-dialog4 #cancel {
      position: absolute;
      top: 10px;
      right: 10px;
      /* background-color: rgb(233 55 55); */
      color: black;
      padding: 4px 7px;
    }
    .form-dialog4 #cancel:hover {
      background-color: #f03434;
      color: white;
    }
    .form-dialog4 #delCmt {
      background-color: rgb(233 55 55);
    }

    .form-dialog4 #updtComment {
      background-color: green;
    }
  `;

  dataList = {};

  constructor() {
    super();
    this.isFormOpen = false;
    this.isOpenForm = false;
    this.isEditDialogOpen = false;
    this.isAddDataDialogOpen = false;
    this.isCommentPresent = false;
    this.widgetKey = ``;
    this.updatedLabelInput = "";
    this.updatedCommentInput = "";
    this.updatedContentInput = "";
    this.isAddCommentDialogOpen = false;
    this.dashboardId = dashboardId;
  }

  // async loadDashboard(uId, uNm) {
  //   await get(child(dbref, "user/" + uId))
  //     .then((snapshot) => {
  //       if (snapshot.exists()) {
  //         console.log(" snapshot.val().dsh", snapshot.val().dsh);
  //         dashboardId = snapshot.val().dsh;
  //         console.log(dashboardId);
  //         onValue(child(dbref, `dashboard/${dashboardId}`), (snapshot) => {
  //           this.dataList = snapshot.val();
  //           this.requestUpdate();
  //         });
  //       } else {
  //         alert("user not found");
  //       }
  //     })
  //     .catch((error) => {
  //       alert("Unsuccessful, error " + error);
  //     });
  // }



  async loadDashboard(dashboardId) {
    const dashboardRef = child(dbref, `dashboard/${dashboardId}`);

    try {
      const snapshot = await get(dashboardRef);
      if (snapshot.exists()) {
        this.dataList = snapshot.val();
        onValue(child(dbref, `dashboard/${dashboardId}`), (snapshot) => {
          this.dataList = snapshot.val();
          this.requestUpdate();
        });
        console.log("this.dataList", this.dataList);
        // this.requestUpdate();
      } else {
        alert("Dashboard not found");
      }
    } catch (error) {
      alert("Unsuccessful, error " + error);
    }
  }

  connectedCallback() {
    super.connectedCallback();

    // Get the current URL parameters
    const urlParams = new URLSearchParams(window.location.search);

    // Assuming "tvId" is the parameter name in the URL
    const tvId = urlParams.get("tvId");

    if (tvId) {
      const tvRef = child(dbref, `tv/${tvId}`);
      get(tvRef).then((snapshot) => {
        if (snapshot.exists() && snapshot.val().dsh) {
          dashboardId = snapshot.val().dsh;
          console.log("dashboardId", dashboardId);
          this.loadDashboard(dashboardId);
        } else {
          alert("Dashboard not found for this user");
        }
      }).catch((error) => {
        alert("Unsuccessful, error " + error);
      });
    } else {
      alert("tvId parameter not found in the URL");
    }
  }





  //Add new Widget
  addNewWidget(event) {
    event.preventDefault();
    console.log("dashboardId", dashboardId);
    console.log("dashboardId", dashboardId);
    const form = event.target;
    const titleInput = form.elements.titleInput;
    const contentInput = form.elements.contentInput;
    const labelInput = form.elements.labelInput;
    const commentInput = form.elements.commentInput;

    const newWidget = {
      title: titleInput.value,
      data: {},
      comment: commentInput.value,
    };

    //autogenerating keys
    const newDataRef = push(ref(db, `dashboard/${dashboardId}/widgets`));
    console.log("dashboardId", dashboardId);
    const newDataKey = newDataRef.key;

    // data properties to the autogenerated key
    newWidget.data[newDataKey] = {
      lbl: labelInput.value,
      txt: contentInput.value,
      // cmt: commentInput.value
    };

    const addConfirmed = confirm("Are you sure you want to add new Widget?");
    if (addConfirmed) {
    // Saving the new widget data to fb
    const widgetRef = ref(db, `dashboard/${dashboardId}/widgets`);
    console.log("dashboardId", dashboardId);
    const newWidgetRef = push(widgetRef);
    const newWidgetKey = newWidgetRef.key;
    console.log("newWidgetKey", newWidgetKey);

    const updates = {};
    updates[`dashboard/${dashboardId}/widgets/${newWidgetKey}`] = newWidget;

    update(ref(db), updates)
      .then(() => {
        titleInput.value = "";
        contentInput.value = "";
        labelInput.value = "";
        commentInput.value = "";
        this.isFormOpen = false;
      })
      .catch((error) => { });
    }
  }

  openDataForm(key, dataKey) {
    this.isEditDialogOpen = true;
    this.widgetKey = key;
    this.dataKey = dataKey;
    const widgetRef = ref(
      db,
      `dashboard/${dashboardId}/widgets/${this.widgetKey}/data/${dataKey}`
    );

    onValue(widgetRef, (snapshot) => {
      const widgetData = snapshot.val();
      if (widgetData) {
        const dataKeys = Object.keys(widgetData);
        setTimeout(() => {
          const form = this.shadowRoot.querySelector(".form-dialog2");
          const contentInput = form.querySelector("#updatedContentInput");
          const labelInput = form.querySelector("#updatedLabelInput");
          const commentIpt = form.querySelector("#updatedCommentInput"); //here only i need to make changes for comment to get commnet vale ininput field

          if (contentInput && labelInput && commentIpt) {
            contentInput.value = widgetData.txt || "";
            labelInput.value = widgetData.lbl || "";
            commentIpt.value = widgetData.cmt || '';

          }
        }, 100);
        // }
      }
    });
  }

  //the form should close i.e.,cancel button
  closeEditDialog() {
    this.isEditDialogOpen = false;
  }

  closeEditDialog2() {
    // this.isAddDataDialogOpen = false;
    this.isOpenForm = false;
  }

  //Add data in particular Widget
  addWidgetData(event) {
    event.preventDefault();
    const form = event.target.closest("form");

    const content = form.elements.contentInput;
    const label = form.elements.labelInput;
    // const title = form.elements.titleInput;

    const newDataRef = ref(
      db,
      `dashboard/${dashboardId}/widgets/${this.widgetKey}/data`
    );

    // data properties to the autogenerated key
    const newData = {
      lbl: label.value,
      txt: content.value,
      // cmt: comment.value
    };

    // Saving the new widget data to fb
    const newWidgetRef = push(newDataRef);
    const newWidgetKey = newWidgetRef.key;
    console.log("widgetKey", this.widgetKey);
    const dataConfirmed = confirm("Are you sure you want to add data?");
    if (dataConfirmed) {
    const widgetRef = ref(
      db,
      `dashboard/${dashboardId}/widgets/${this.widgetKey}/data/${newWidgetKey}`
    );

    set(widgetRef, newData)
      .then(() => {
        content.value = "";
        label.value = "";
        this.closeEditDialog2();
        // this.formClose();
        console.log("Data updated successfully");
      })
      .catch((error) => {
        console.log("Error updating data:", error);
      });
    }
  }

  //delete logic of paticular node
  async deleteWidgetData() {
    const deleteConfirmed = confirm("Are you sure you want to delete?");
    if (deleteConfirmed) {
      const widgetRef = ref(
        db,
        `dashboard/${dashboardId}/widgets/${this.widgetKey}/data/${this.dataKey}`
      );
      try {
        await remove(widgetRef);
        this.closeEditDialog();
        console.log("Widget data deleted successfully!!");
      } catch (error) {
        console.error("Error deleting widget data:", error);
      }
    }
  }

  async deleteWidget() {
    const deleteConfirm = confirm(
      "Are you sure you want to delete the widget?"
    );
    if (deleteConfirm) {
      const widgetRef = ref(
        db,
        `dashboard/${dashboardId}/widgets/${this.widgetKey}`
      );
      console.log(widgetRef);
      await remove(widgetRef)
        .then(() => {
          this.closeEditDialog2();
          console.log("widget deleted successfully!!");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  updateTitle() {
    const updateConfirm = confirm(
      "Are you sure you want to update the widget title?"
    );
    if (updateConfirm) {
      const widgetRef = ref(
        db,
        `dashboard/${dashboardId}/widgets/${this.widgetKey}`
      );

      const updatedTitleInput =
        this.renderRoot.querySelector("#updatedTitleInput");
      const updatedTitle = updatedTitleInput.value;

      update(widgetRef, {
        title: updatedTitle,
      })
        .then(() => {
          console.log("Title updated successfully");

          this.closeEditDialog2();
        })
        .catch((error) => {
          console.error("Error updating title:", error);
        });
    }
  }

  addComment() {
    const addCommentInput = this.shadowRoot.querySelector("#addCommentInput");
    console.log("widgetKey", this.widgetKey);
    const addConfirm = confirm(
      "Are you sure you want to add the comment?"
    );
    if (addConfirm) {
    const widgetRef = ref(db, `dashboard/${dashboardId}/widgets/${this.widgetKey}/comment`);

    set(widgetRef, addCommentInput.value)
      .then(() => {
        addCommentInput.value = "";
        this.closeEditDialog2();
        console.log("Comment updated successfully");
      })
      .catch((error) => {
        console.log("Error updating comment:", error);
      });
    }
  }

  updateWidgetData(event) {
    event.preventDefault();
    const form = this.shadowRoot.querySelector(".form-dialog2");
    const contentInput = form.querySelector("#updatedContentInput");
    const labelInput = form.querySelector("#updatedLabelInput");
    const commentInput = form.querySelector("#updatedCommentInput");
    const updatedData = {
      lbl: labelInput.value,
      txt: contentInput.value,
      cmt: commentInput.value
    };

    const updateConfirm = confirm(
      "Are you sure you want to update?"
    );
    if (updateConfirm) {
    const updatedDataRef = ref(
      db,
      `dashboard/${dashboardId}/widgets/${this.widgetKey}/data/${this.dataKey}`
    );



    update(updatedDataRef, updatedData)
      .then(() => {
        console.log("Data updated successfully");
        this.closeEditDialog();
        // this.isFormOpen = false;
      })
      .catch((error) => {
        console.log("Error updating data:", error);
      });
    }

  }

  addFooterComment() {
    const addConfirm = confirm(
      "Are you sure you want to update the comment?"
    );
    if (addConfirm) {
    const widgetRef = ref(
      db,
      `dashboard/${dashboardId}/widgets/${this.widgetKey}`
    );

    const updatedCmtInput = this.renderRoot.querySelector("#updatedCmt");
    const updatedComment = updatedCmtInput.value;

    update(widgetRef, {
      comment: updatedComment,
    })
      .then(() => {
        console.log("Footer comment added successfully");
        // this.isAddCommentDialogOpen = false;
        this.commentFormClose();
      })
      .catch((error) => {
        console.error("Error adding footer comment:", error);
      });
    }
  }

  commentForm(key, text) {
    this.isAddCommentDialogOpen = true;
    this.widgetKey = key;

    const widgetRef = ref(
      db,
      `dashboard/${dashboardId}/widgets/${this.widgetKey}`
    );

    onValue(widgetRef, (snapshot) => {
      const widgetData = snapshot.val();
      const updatedComment = widgetData?.comment || "";

      setTimeout(() => {
        const commentInput = this.renderRoot.querySelector("#updatedCmt");
        if (commentInput) {
          commentInput.value = updatedComment;
        }
      }, 0);
    });
  }

  updateCommentInputValue(updatedComment) {
    const commentInput = this.renderRoot.querySelector("#updatedCmt");
    if (commentInput) {
      commentInput.value = updatedComment;
    }
  }

  async deleteCommentData() {
    const deleteConfirm = confirm(
      "Are you sure you want to delete the widget comment?"
    );
    if (deleteConfirm) {
      const widgetRef = ref(
        db,
        `dashboard/${dashboardId}/widgets/${this.widgetKey}/comment`
      );
      console.log(this.widgetKey);
      await remove(widgetRef)
        .then(() => {
          this.addFooterComment();
          console.log("comment deleted successfully!!");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  openForm() {
    this.isFormOpen = true;
  }

  closeForm() {
    this.isFormOpen = false;
  }

  formOpen(key, title) {
    this.isOpenForm = true;
    this.widgetKey = key;
    console.log(title);
    if (this.isOpenForm) {
      console.log("title", title);
      console.log(" this.widgetKey", this.widgetKey);

      const form = this.shadowRoot.querySelector(".form-dialog3");
      const titleInput = form.querySelector("#updatedTitleInput");
      const addCommentInput = form.querySelector("#addCommentInput");
      console.log("titleInput", titleInput);
      console.log("addCommentInput", addCommentInput);

      if (titleInput) {
        titleInput.value = title;
      }

      const widgetRef = ref(db, `dashboard/${dashboardId}/widgets/${this.widgetKey}`);
      console.log(widgetRef);
      get(widgetRef).then((snapshot) => {
        if (snapshot.val().comment == '') {
          console.log("no comment");
          this.isCommentPresent = true;
        }
        else {
          this.isCommentPresent = false;
          console.log(snapshot.val().comment);
          console.log("already comment exists");
        }
      })

      // Check if the addCommentInput field has a value
      //  this.isCommentPresent = addCommentInput && addCommentInput.value.trim() !== "";
      //  this.isCommentPresent =  ;
      // console.log("addCommentInput.value.trim() ",addCommentInput.value.trim());
    }
  }

  formClose() {
    this.isOpenForm = false;
  }

  commentFormClose() {
    this.isAddCommentDialogOpen = false;
  }

  render() {
    const widgets =
      this.dataList && this.dataList.widgets ? this.dataList.widgets : null;

    return html`
      <div id="head">
        ${widgets === null
        ? html`
              <!-- Only show logout button when user is not found -->
              <!-- <button type="submit" id="logoutBtn" @click=${this.handleLogout}>Logout</button> -->
            `
        : html`
        <!-- Add  new widget -->
        <!-- Show both Add Widget button and logout button when user is found -->
        <button class="open-button" @click=${this.openForm}>Add Widget</button>
        <!-- <button type="submit" id="logoutBtn" @click=${this.handleLogout}>
          Logout
        </button> -->
        `}
      </div>
      <div id="dataList" class="container">
      ${widgets === null
        ? html` Loading data... `
        : Object.keys(widgets).map((key) => {
          const widget = widgets[key];
          const widgetClass = `widget ${widget.pos}`;
          const headerClass = widget.pos === "header" ? "header-widget" : "";
          html`
            <div
              class="header-widget ${headerClass}"
              @click=${() => this.formOpen(key, widget.title, widget.comment)}
            >
              ${widget.title}
            </div>
          `;

          return html`
            <div class="${widgetClass}">
              <h1
                class="header"
                @click=${() => this.formOpen(key, widget.title)}
              >
                ${widget.title}
              </h1>
              <!-- <h1 class="header" @click=${() => {
              setTimeout(() => {
                this.formOpen(key, widget.title);
              }, 0);
            }}>${widget.title}</h1>  -->
              ${Object.keys(widget.data || {}).length === 1
              ? html`
                    ${Object.keys(widget.data).map((dataKey) => {
                const dataItem = widget.data[dataKey];
                return html`
                        <div
                          class="content"
                          @click=${() => this.openDataForm(key, dataKey)}
                        >
                          ${dataItem.txt}
                          ${dataItem.cmt} 
                        </div>
                      `;
              })}
                  `
              : html`
                    <ul class="list">
                      ${Object.keys(widget.data || {}).map((dataKey) => {
                const dataItem = widget.data[dataKey];
                return html`
                          <li @click=${() => this.openDataForm(key, dataKey)}>
                            <span class="listLabel">${dataItem.lbl}: </span>
                            <span class="listText">${dataItem.txt}</span>
                          ${dataItem.cmt}
                          </li>
                        `;
              })}
                    </ul>
                  `}

              <h3
                class="footer"
                @click=${() => this.commentForm(key, widget.comment)}
              >
                ${widget.comment}
              </h3>
            </div>
          `;
        })}
      </div>

      <dialog class="form-dialog" ?open=${this.isFormOpen}>
        <div class="form-popup" id="myForm">
          <form @submit=${this.addNewWidget} class="form-container">
            <label for="title">Title:</label>
            <input type="text" id="titleInput" name="title" required />

            <label for="label">Label:</label>
            <input type="text" id="labelInput" name="label" />

            <label for="content">Content:</label>
            <input type="text" id="contentInput" name="content" />
            
            <label for="comment">Comment:</label>
            <input type="text" id="commentInput" name="comment" />

            <div class="button-group">
              <button type="submit" id="add_Data">Add Data</button>
              <button type="button" id="btn_cancel" @click=${this.closeForm}>
                Close
              </button>
            </div>
          </form>
        </div>
      </dialog>

      <!--  -->
      ${this.isEditDialogOpen
        ? html`
            <div class="form-dialog2" id="myForm2">
              <form>
              <label for="updatedLabelInput">Label:</label>
                <input
                  type="text"
                  id="updatedLabelInput"
                  name="updatedLabelInput"
                />

                <label for="updatedContentInput">Content:</label>
                <input
                  type="text"
                  id="updatedContentInput"
                  name="updatedContentInput"
                  required
                />

                <label for="updatedCommentInput">Comment:</label>
                <input
                  type="text"
                  id="updatedCommentInput"
                  name="updatedCommentInput"
                />

                <div class="button-group">
                  <button id="updtBtn" @click=${this.updateWidgetData}>
                    Update
                  </button>
                  <button
                    type="button"
                    class="cancel-button"
                    @click=${this.deleteWidgetData}
                  >
                    Delete
                  </button>
                </div>

                <button
                  type="button"
                  class="cancel"
                  @click=${this.closeEditDialog}
                >
                  x
                </button>
              </form>
            </div>
          `
        : ""}

      <!-- Dialog box for adding data to existing Widget -->

      <dialog class="form-dialog3" ?open=${this.isOpenForm}>
        <div class="form-dialog3" id="myForm3">
          <form class="form-container">
            <div id="titleEditDivLabel">
              <label for="title">Title:</label>
            </div>
            <div id="titleEditDivInBtn">
              <input type="text" id="updatedTitleInput" name="title" />
              <button type="button" id="editTitle" @click=${this.updateTitle}>
                Update Title
              </button>
            </div>
            <label for="label">Label:</label>
            <input type="text" id="labelInput" name="label" />
            
            <label for="content">Content:</label>
            <input type="text" id="contentInput" name="content" />

           

            <div class="button-group">
              <button type="button" id="addData" @click=${this.addWidgetData}>Add Data</button>
              <button type="button" class="cancel-button" @click=${this.deleteWidget}>Delete</button>
            </div>

            ${this.isCommentPresent
        ? html`
            <div id="commentDivLabel">
              <label for="comment">Comment:</label>
            </div>
            <div id="commentDivInBtn">
              <input type="text" id="addCommentInput" name="comment" />
              <button type="button" id="editTitle" @click=${this.addComment}>Add Comment</button>
            </div>
            `
        : html``}

            <button type="button" class="cancel" @click=${this.formClose}>x</button>
          </form>
        </div>
      </dialog>

      ${this.isAddCommentDialogOpen
        ? html`
            <div class="form-dialog4" id="myForm4">
              <form class="form-container">
                <label for="comment">Comment:</label>
                <input type="text" id="updatedCmt" name="updatedCmt" />
                <div class="button-group">
                  <button
                    type="button"
                    id="updtComment"
                    @click=${() => this.addFooterComment()}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    id="delCmt"
                    @click=${() => this.deleteCommentData()}
                  >
                    Delete
                  </button>
                </div>
                <button
                  type="button"
                  id="cancel"
                  @click=${this.commentFormClose}
                >
                  x
                </button>
              </form>
            </div>
          `
        : ""}
    `;
  }
}
customElements.define("my-dashboard", MyDashboard);
