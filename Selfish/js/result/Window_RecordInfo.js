//-----------------------------------------------------------------------------
// Window_RecordInfo
//

class Window_RecordInfo extends Window_Base {
    constructor(x, y, width, height){
        super(new Rectangle( x, y, width, height));
        this.opacity = 0;
        this._listX = 240;
        this._countX = 424;
        this._info = null;
    }

    setDataInfo(data,rankingData){
        this._info = data;
        this._rank = rankingData;
        this.refresh();
    }

    refresh(){
        this.contents.clear();
        this.drawInfo();
    }

    drawInfo(){
        if (this._info){
            const x = this._listX;
            const x2 = this._countX;
            const y = 24;
            const lineHeight = 48;
            if (this._info._type == Game_ResultType.Base){
                this.drawBattleCount(x,x2,y + lineHeight);
                this.drawWinBattleCount(x,x2,y + lineHeight * 2);
                this.drawLoseBattleCount(x,x2,y + lineHeight * 3);
                this.drawEnemyCount(x,x2,y + lineHeight * 4);
                this.drawMaxDamage(x,x2,y + lineHeight * 5);
                this.drawMagicLearnCount(x,x2,y + lineHeight * 6);
                this.drawMostUseActor(x,x2,y + lineHeight * 7);
            }
            if (this._info._type == Game_ResultType.Battle){
                //this.drawStageName(x,x2,y + lineHeight);
                this.drawClearTime(x,x2,y + lineHeight * 1);
                this.drawTurnCount(x,x2,y + lineHeight * 2);
                this.drawPartyList(x,x2,y + lineHeight * 4,lineHeight);
                //this.drawBossName(x,x2,y + lineHeight * 6);
                this.drawFinishActorName(x,x2,y + lineHeight * 7);
                this.drawFinishSkillName(x,x2,y + lineHeight * 8);
    
            }
        }
    }

    drawStageName(x,x2,y){
        if (this._info._id){
            this.setFlatMode();
            this.drawText(TextManager.getText(1100800) ,x,y,248);
            this.drawText(TextManager.getText(DataManager.getStageInfos(this._info._id).nameId) ,x2,y,248,'right');
        }
    }

    drawClearTime(x,x2,y){
        if (this._info._time){
            this.setFlatMode();
            this.drawText(TextManager.getText(1100900) ,x,y,248);
    
            var ts = this._info._time;
            var d = new Date( ts );
            var year  = d.getFullYear();
            var month = ((d.getMonth() + 1) < 10) ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
            var day  = (d.getDate() < 10) ? '0' + d.getDate() : d.getDate();
            var hour = ( d.getHours()   < 10 ) ? '0' + d.getHours()   : d.getHours();
            var min  = ( d.getMinutes() < 10 ) ? '0' + d.getMinutes() : d.getMinutes();
            var text = ( year + '  ' + month + '  ' + day + '  ' + hour + ':' + min  );
            this.drawText(text, x2 + 40, y, 240);
            this.contents.fontSize = 16;
            this.drawText('/', x2 + 50 + 40, y - 1, 240);
            this.drawText('/', x2 + 96 + 40, y - 1, 240);
    
            this.resetFontSettings();
            //this.drawText(this._info._time ,x2,y,248,'right');
        }
    }

    drawTurnCount(x,x2,y){
        if (this._info._turnCount){
            this.setFlatMode();
            var rank = this._rank;
            this.drawText(TextManager.getText(1101000) ,x,y,248);
            this.drawText(this._info._turnCount + TextManager.getText(1100101),x2,y,248,'right');
            if (rank && rank != -1){
                this.drawText(TextManager.getText(1100102)+ (rank+1) +TextManager.getText(1100103),x2,y + 48,248,'right');
            } else{
                if (rank){

                    this.drawText(TextManager.getText(1100102)+TextManager.getText(1100104),x2,y + 48,248,'right');
                }
            }
        }
    }

    drawPartyList(x,x2,y,lineHeight){
        if (this._info._partyMemberId){
            this.setFlatMode();
            this.drawText(TextManager.getText(1101100) ,x,y,248);
            for (var i = 0; i < this._info._partyMemberId.length ;i++){
                const actorName = TextManager.actorName(this._info._partyMemberId[i]);
                this.drawText(actorName ,x2,y + lineHeight * i,248,'right');
            }
        }
    }

    drawBossName(x,x2,y){
        if (this._info._bossId){
            this.setFlatMode();
            this.drawText(TextManager.getText(1101200) ,x,y,248);
            this.drawText($dataEnemies[this._info._bossId].name ,x2,y,248,'right');
        }
    }

    drawFinishActorName(x,x2,y){
        if (this._info._finishActorId){
            this.setFlatMode();
            this.drawText(TextManager.getText(1101300) ,x,y,248);
            const actorName = TextManager.actorName(this._info._finishActorId);
            this.drawText(actorName ,x2,y,248,'right');
        }
    }

    drawFinishSkillName(x,x2,y){
        if (this._info._finishSkillId){
            this.setFlatMode();
            this.drawText(TextManager.getText(1101400) ,x,y,248);
            const skillName = TextManager.getSkillName(this._info._finishSkillId);
            this.drawText(skillName ,x2,y,248,'right');
        }
    }

    drawBattleCount(x,x2,y){
        if ($gameSystem.battleCount()){
            this.setFlatMode();
            this.drawText(TextManager.getText(1100100) ,x,y,248);
            this.drawText($gameSystem.battleCount() ,x2,y,248,'right');
        }
    }

    drawWinBattleCount(x,x2,y){
        if ($gameSystem.winCount()){
            this.setFlatMode();
            this.drawText(TextManager.getText(1100200) ,x,y,248);
            this.drawText($gameSystem.winCount() ,x2,y,248,'right');
        }
    }

    drawLoseBattleCount(x,x2,y){
        if ($gameSystem.loseCount()){
            this.setFlatMode();
            this.drawText(TextManager.getText(1100300) ,x,y,248);
            this.drawText($gameSystem.loseCount(),x2,y,248,'right');
        }
    }

    drawEnemyCount(x,x2,y){
        if ($gameSystem.enemyDefeatCount() != null){
            this.setFlatMode();
            this.drawText(TextManager.getText(1100400) ,x,y,248);
            this.drawText($gameSystem.enemyDefeatCount(),x2,y,248,'right');
        }
    }

    drawMaxDamage(x,x2,y){
        if ($gameSystem.maxDamage() != null){
            this.setFlatMode();
            this.drawText(TextManager.getText(1100500) ,x,y,248);
            this.drawText($gameSystem.maxDamage(),x2,y,248,'right');
        }
    }

    drawMagicLearnCount(x,x2,y){
        if (this._info){
            this.setFlatMode();
            this.drawText(TextManager.getText(1100600) ,x,y,248);
            this.drawText($gameParty._learnedSkills.length ,x2,y,248,'right');
        }
    }

    drawMostUseActor(x,x2,y){
        if (this._info){
            this.setFlatMode();
            this.drawText(TextManager.getText(1100700) ,x,y,248);
            const actorName = TextManager.actorName(this._info.actor().id);
            this.drawText(actorName ,x2,y,248,'right');
        }
    }
}