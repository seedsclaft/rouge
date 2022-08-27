//=============================================================================
// Game_Quiz.js
//=============================================================================
/*:
 * @plugindesc クイズデータ。
 * @author econa
 *
 * @param QuizList
 * @desc クイズデータリスト
 * @type struct<Quiz>[]
 * */

/*~struct~Quiz:
 * @param question
 * @type string
 * @default ""
 * 
 * @param answer
 * @type number
 * @default 1
 * 
 * @param choise
 * @type string[]
 * */


//-----------------------------------------------------------------------------
// Game_Quiz
//
// The game object class for an actor.

function Game_Quiz() {
  this.initialize.apply(this, arguments);
}

Game_Quiz.prototype.initialize = function() {
    this._data = PluginManager.parameters('Game_Quiz');
    let list = [];
    JSON.parse(this._data.QuizList).forEach((quiz,index) => {
        var data = JSON.parse(quiz);
        data.choise = JSON.parse(data.choise);
        data.index = index;
        list.push(data);
    });
    this._data = list;

    var quizQuestion = [];
    var quizChoices = [];
    this._data.forEach(quiz => {
        quizQuestion.push(quiz.question);
        quizChoices.push(quiz.choise);
    });

};

Game_Quiz.prototype.getQuiz = function() {
    const quiz = this._data[Math.randomInt(this._data.length)];
    this._data = _.without(this._data,quiz);
    return quiz;
}

