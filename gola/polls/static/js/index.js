var React = require('react');
var ReactDOM = require('react-dom');
var style = require('../css/question.css');
var calender_style = require('../css/calendar.css');
var TextQuestion = require('./TextQuestion.js');
var {CalendarQuestion} = require('./CalendarQuestion.jsx');
var MapQuestion = require('./MapQuestion.js');

var qListJSON = {
  "questions": []
};

var qJSON = {
  "type": "",
  "question": "",
  "options": []
};

var Questions = React.createClass({
  getInitialState: function(){
    return{ 
      initialized: false,
      title: "",
      noti_email: "",
      noti_count: "",
      questions: []
    };
  },

  addQuestion: function(){
    console.log("Question added");
    var newQuestions = this.state.questions.slice();
    newQuestions.push(this.refs.newQuestion.submit());
    console.log(newQuestions);
    this.setState({questions: newQuestions});
    this.refs.newQuestion.refresh();
  },

  finish: function(){
    console.log("Question Finish");
    this.addQuestion();
    var pollJSON = {
      "questions": this.state.questions,
      "title": this.state.title,
      "noti_email": this.state.noti_email,
      "noti_count": parseInt(this.state.noti_count)
    };
    $.ajax({
    type: "POST",
      url: "/create/",
      data: JSON.stringify(pollJSON),
  }).done(function(data) {
      console.log(data);
      location.href = data;
  });

  },

  startQuestion: function(){
    console.log("Initialized!");
    this.setState({
      initialized: true,
      title: this.refs.initPoll.refs.title.value,
      noti_email: this.refs.initPoll.refs.email.value,
      noti_count: this.refs.initPoll.refs.notiCount.value
    });
  },

  render: function(){
    var self = this;
    if (self.state.initialized){
      return (
        <div>
          <MenuExample ref="newQuestion" questionNumber={self.state.questions.length} items={ ['TEXT', 'IMAGE', 'IMAGE TAGGING', 'VIDEO', 'CALENDAR', 'MAP'] } />
          <button className="NextQuestionBtn" onClick={this.addQuestion}></button>
          <button className="CompleteBtn" onClick={this.finish}></button>
        </div>
      );
    }
    else{
      return (
        <div>
          <InitPollWrapper ref="initPoll"/>
          <br/>
          <button className="StartBtn" onClick={this.startQuestion}></button>
        </div>
      );
    }
  }
});

var QuestionInput = React.createClass({
  getInitialState: function() {
      return {value: ''};
  },
  handleChange: function(event) {
    console.log("event is");
    console.log(event);
    this.setState({value: event.target.value});
  },
  render: function() {
    return (
        <input
            type="text"
            id="question"
            placeholder="Enter the question"
            value={this.state.value}
            onChange={this.handleChange}
          />
      );
    }
});

var InitPollWrapper = React.createClass({
  getInitialState: function() {
    return {
      title: "",
      noti_email: "",
      noti_count: ""
    };
  },

  render: function() {
    return(
      <div className="initPoll">
        <font size="4" color="#002b80"><b>Poll Title: </b></font><input type="text" id="initPoll" className="title" ref="title"/><br/>
        <font size="4" color="#002b80"><b>Your Email Address: </b></font><input type="text" id="initPoll" className="email" ref="email"/><br/>
        <font size="4" color="#002b80"><b>Number of particpants before notification: </b></font><input type="number" id="initPoll" className="notiCount" ref="notiCount"/>
      </div>
    );
  }
});

var MenuExample = React.createClass({

    getInitialState: function(){
        return { focused: 0 };
    },

    refresh: function(){
      this.setState(this.getInitialState());
      this.refs.content.refresh();
    },

    submit: function(){
      var menulist = ["text", "image", "imagetag", "video", "calendar", "map"];
      console.log("multiple checked value");
      return (
        {
          "multiple": this.refs.multipleCheck.checked,
          "type": menulist[this.state.focused],
          "question": this.refs.questioninput.state.value,
          "imgsrc": this.refs.content.submit().imgsrc,
          "options": this.refs.content.submit().options
        }
      );
    },

    clicked: function(index){

        // The click handler will update the state with
        // the index of the focused menu entry

        this.setState({focused: index});
    },

    render: function() {

        // Here we will read the items property, which was passed
        // as an attribute when the component was created

        var self = this;

        // The map method will loop over the array of menu entries,
        // and will return a new array with <li> elements.

        return (
            <div>
            	<font size="4" color="#002b80">{self.props.questionNumber}.</font>
            	<QuestionInput ref="questioninput"/>
                <ul id="questiontabs">{ this.props.items.map(function(m, index){
        
                    var style = '';
        
                    if(self.state.focused == index){
                        style = 'focused';
                    }
        
                    // Notice the use of the bind() method. It makes the
                    // index available to the clicked function:
        
                    return <li key={index} id="questiontab" className={style} onClick={self.clicked.bind(self, index)}>{m}</li>;
        
                }) }
                        
                </ul>
                <br/><br/>
                <div className="multipleAnswer"><b>Allow Multiple Answer</b></div>
                <label className="switch">
                <input type="checkbox" ref="multipleCheck"/>
                <div className="slider round"></div>
                </label><br/><br/>
                <Content ref="content" currentTab={this.state.focused}/>
          </div>
        );
    }
});

var Content = React.createClass({
		refresh: function(){
			switch(this.props.currentTab) {
			    case 0:
			        this.refs.text.refresh();
			        break;
			    case 1:
			        this.refs.image.refresh();
			        break;
			    case 2:
			        this.refs.tagimage.refresh();
			        break;
			    case 3:
			        this.refs.video.refresh();
			        break;
			    case 4:
			        this.refs.calendar.refresh();
			        break;
			    case 5:
			        this.refs.map.refresh();
			        break;
			}
		},

		submit: function(){
			switch(this.props.currentTab) {
			    case 0:
			        return(this.refs.text.submit());
			    case 1:
			        return(this.refs.image.submit());
			    case 2:
			        return(this.refs.tagimage.submit());
			    case 3:
			        return(this.refs.video.submit());
			    case 4:
			        return(this.refs.calendar.submit());
			    case 5:
			        return(this.refs.map.submit());
			}
		},
    render: function(){
        return(
            <div className="content">
            	{this.props.currentTab === 0 ?
            	<div className="text">
                    <TextQuestion ref="text"/>
                </div>
                :null}

                {this.props.currentTab === 1 ?
                <div className="image">
                    <ImageQuestion ref="image"/>
                </div>
                :null}

                {this.props.currentTab === 2 ?
                <div className="tagimage">
                    <TaggedImageUpload ref="tagimage"/>
                </div>
                :null}

                {this.props.currentTab === 3 ?
                <div className="video">
                    <VideoQuestion ref="video" />
                </div>
                :null}
            
                {this.props.currentTab === 4 ?
                <div className="calendar-wrapper">
                    <CalendarQuestion ref="calendar"/>    
                </div>
                :null}

                {this.props.currentTab === 5 ?
                <div className="map-wrapper">
                    <MapQuestion ref="map"/>
                </div>
                :null}
            </div>
        );
    }
});

var ImageList = React.createClass({
    render: function() {
      var self = this;
      console.log(this.props);
      return (
        <ul id="options">{ this.props.children.map(function(child, index){
          return (
            <li key={index} id="option">
              <b>Answer Choice {index+1}: </b>
              <div id="myDiv">
                <img src={child} />
              </div>
              <button id="deleteopt" onClick={self.props.onDeleteItem.bind(null, index)}></button>
            </li>
          )})}
        </ul>
      );
    }
});

var ImageQuestion = React.createClass({
    getInitialState: function() {
      return {
          items: []
      };
    },

    refresh: function(){
      this.setState(this.getInitialState());
    },

    submit: function(){
      console.log("ImageQuestion submit called");
      console.log(this.state.items);
      return {
        "options": this.state.items
      };
    },

    render: function() {
      return (
        <div>
          <ImageList onDeleteItem={this.onDeleteItem}>{this.state.items}</ImageList>
          <ImageUploadIns ref="new_item"/>
          <button id="addopt_image" type="button" onClick={this.onAddClicked}></button>
        </div>
      );
    },

    onAddClicked: function() {
      var newItems = this.state.items.slice();
      var imagePreviewURL = this.refs.new_item.state.imagePreview;
      newItems.push(imagePreviewURL);
      this.setState({items: newItems});
      this.refs.new_item.refresh();
    },

    onDeleteItem: function(index) {
      var newItems = this.state.items.slice();
      console.log("This item about to be removed")
      console.log(newItems[index]);
      newItems.splice(index, 1);
      this.setState({items: newItems});
    }
});

var ImageUploadIns = React.createClass({
  getInitialState: function(){
        return { imagePreview: "../../../static/images/ImageUploadButton.png" };
    },

    refresh: function(){
      this.setState(this.getInitialState());
    },

    handleSubmit: function(){
      console.log("Submit called");
    },

    handleImageChange: function(e){
      self = this;
      console.log("Image Changed!");
      var file = e.target.files[0];
      var reader = new FileReader();
      reader.onload = function(e) {
        //console.log(e.target.result);
        self.setState({imagePreview: e.target.result});
      };
      reader.readAsDataURL(file);
    },

  render: function(){
    var imagePreview = (
      <div id="myDiv">
          <img src={this.state.imagePreview} />
      </div>);
    return (
      <div id="previewComponent">
            <form onSubmit={this.handleSubmit()}>
              <label id="myLabel">
                {imagePreview}
                <input ref="fileinput" id="fileinput" type="file" onChange={this.handleImageChange}></input>
              </label>
            </form>
          </div>
    )
  }
});

var ImageTagList= React.createClass({
    render: function() {
      var self = this;
      
      var taggedImage= (
        <div id="taggedImage">
          <img src={this.state.imagePreview}/>
        </div>
      );

      return (
        <ul id="options">{ this.props.children.map(function(child, index){
                  return (
                    <li key={index} id="option">
                      <b>Answer Choice {index+1}: </b>
                      <div id="myDiv">
                <img src={child} />
            </div>
                      <button id="deleteopt" onClick={self.props.onDeleteItem.bind(null, index)}></button>
                    </li>
                  )

                  }) }
                      
              </ul>
      );
    }
});

var ImageTagQuestion = React.createClass({
    getInitialState: function() {
      return {
          items: []
      };
    },

    render: function() {
      return (
        <div>
          <ImageList onDeleteItem={this.onDeleteItem}>{this.state.items}</ImageList>
          <ImageUploadIns ref="new_item"/>
          <button id="addopt_image" type="button" onClick={this.onAddClicked}></button>
        </div>
      );
    },

    onAddClicked: function() {
      var newItems = this.state.items.slice();
      var imagePreviewURL = this.refs.new_item.state.imagePreview;
      newItems.push(imagePreviewURL);
      this.setState({items: newItems});
      this.refs.new_item.refresh();
    },

    onDeleteItem: function(index) {
      var newItems = this.state.items.slice();
      console.log("This item about to be removed");
      console.log(newItems[index]);
      newItems.splice(index, 1);
      this.setState({items: newItems});
    }
});

var TaggedImageUpload = React.createClass({
  getInitialState: function(){
        return { 
          imagePreview: "../../../static/images/ImageUploadButton.png",
          uploaded: false,
          items: []
          };
    },

    refresh: function(){
      this.setState(this.getInitialState());
    },

    submit: function(){
      console.log("TextQuestion submit called");
      console.log(this.state.items);
      return {
        "imgsrc": this.state.imagePreview,
        "options": this.state.items
      };
    },

    handleSubmit: function(){
      console.log("Submit called");
    },

    handleImageChange: function(e){
      self = this;
      console.log("Image Changed!");
      var file = e.target.files[0];
      var reader = new FileReader();
      reader.onload = function(e) {
        //console.log(e.target.result);
        self.setState({imagePreview: e.target.result, uploaded: true});
      };
      reader.readAsDataURL(file);
    },

    onClick: function(e){
      console.log(e.nativeEvent.offsetX);
      console.log(e.nativeEvent.offsetY);
      var top = (e.nativeEvent.offsetY-25).toString();
      var left = (e.nativeEvent.offsetX-25).toString();
      var newItem = {
        width:"50px",
          height:"50px",
          top:top+"px",
          left:left+"px"
    };
    //var newItem= (<div id='rectangle' style={rectStyle}>Hello</div>);
      var newItems = this.state.items.slice();
      newItems.push(newItem);
      this.setState({items: newItems});
    },

  render: function(){
    var imagePreview;
    var content;
    if(this.state.uploaded){
      imagePreview = (
        <div id="taggedImage" onClick={this.onClick}>
            <img src={this.state.imagePreview}/>
            {this.state.items.map(function(tag, index){
                      return (
                        <div id="rectangle" style={tag}/>
                      )}
                  )}
        </div>
      );
      content = (
        <div id="tagImageComponent">
          <form onSubmit={this.handleSubmit()}>
            {imagePreview}<br/>
            <label id="tagImageUploadedLabel">
              <div id="fileUploadChange" />
              <input ref="fileinput" id="fileinput" type="file" onChange={this.handleImageChange}></input>
            </label>
          </form>
        </div>
      );
    }
    else{
      imagePreview = (
        <div id="taggedImage">
            <img src={this.state.imagePreview} />
        </div>
      )
      content = (
        <div id="tagImageComponent">
          <form onSubmit={this.handleSubmit()}>
            <label id="tagImageLabel">
              {imagePreview}
              <input ref="fileinput" id="fileinput" type="file" onChange={this.handleImageChange}></input>
            </label>
          </form>
        </div>
      );

    }
    console.log(content);
    return (
      <div id="temp">
        {content}
      </div>
    );
  }
})

var VideoList = React.createClass({
    render: function() {
      var self = this;
      console.log(this.props);
      return (
        <ul id="options">{ this.props.children.map(function(child, index){
                  return (
                    <li key={index} id="option">
                      <b>Answer Choice {index+1}: </b>
                      <div id="myDiv">
                <iframe width="420" height="315"
                  src={child.replace("watch?v=", "v/")}>
                </iframe>
            </div>
                      <button id="videodeleteopt" onClick={self.props.onDeleteItem.bind(null, index)}></button>
                    </li>
                  )

                  }) }
                      
              </ul>
      );
    }
});

var VideoQuestion = React.createClass({
    getInitialState: function() {
      return {
          items: []
      };
    },

  refresh: function(){
      this.setState(this.getInitialState());
    },

    submit: function(){
      console.log("TextQuestion submit called");
      console.log(this.state.items);
      return {
        "options": this.state.items
      };
    },

    render: function() {
      return (
        <div>
          <VideoList onDeleteItem={this.onDeleteItem}>{this.state.items}</VideoList>
          <input id="option" placeholder="Enter a video link" ref="new_item"/>
          <button id="addopt" type="button" onClick={this.onAddClicked}></button>
        </div>
      );
    },

    onAddClicked: function() {
      var newItems = this.state.items.slice();
      newItems.push(ReactDOM.findDOMNode(this.refs.new_item).value);
      this.setState({items: newItems});
    },

    onDeleteItem: function(index) {
      var newItems = this.state.items.slice();
      console.log("This item about to be removed")
      console.log(newItems[index]);
      newItems.splice(index, 1);
      this.setState({items: newItems});
    }
});

var QuestionInput = React.createClass({
getInitialState: function() {
    return {value: ''};
},
handleChange: function(event) {
  this.setState({value: event.target.value});
},
render: function() {
  return (
      <input
          type="text"
          id="question"
          placeholder="Enter the question"
          value={this.state.value}
          onChange={this.handleChange}
        />
    );
  }
});

	ReactDOM.render(
	  <Questions />,
    document.getElementById('content'))
