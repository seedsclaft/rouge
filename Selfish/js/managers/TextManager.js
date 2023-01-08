//-----------------------------------------------------------------------------
// TextManager
//
// The static class that handles terms and messages.

function TextManager() {
    throw new Error('This is a static class');
}

TextManager.basic = function(basicId) {
    if ($dataText != null){
        return $dataText['systemTerms'].basic[basicId] || '';
    }
    return $dataSystem.terms.basic[basicId] || '';
};

TextManager.param = function(paramId) {
    if ($dataText != null){
        return $dataText['systemTerms'].params[paramId] || '';
    }
    return $dataSystem.terms.params[paramId] || '';
};

TextManager.command = function(commandId) {
    if ($dataText != null){
        return $dataText['systemTerms'].commands[commandId] || '';
    }
    return $dataSystem.terms.commands[commandId] || '';
};

TextManager.message = function(messageId) {
    if ($dataText != null){
        return $dataText['systemTerms'].messages[messageId] || '';
    }
    return $dataSystem.terms.messages[messageId] || '';
};

TextManager.getter = function(method, param) {
    return {
        get: function() {
            return this[method](param);
        },
        configurable: true
    };
};

Object.defineProperty(TextManager, 'currencyUnit', {
    get: function() { return $dataSystem.currencyUnit; },
    configurable: true
});

Object.defineProperties(TextManager, {
    level           : TextManager.getter('basic', 0),
    levelA          : TextManager.getter('basic', 1),
    hp              : TextManager.getter('basic', 2),
    hpA             : TextManager.getter('basic', 3),
    mp              : TextManager.getter('basic', 4),
    mpA             : TextManager.getter('basic', 5),
    tp              : TextManager.getter('basic', 6),
    tpA             : TextManager.getter('basic', 7),
    exp             : TextManager.getter('basic', 8),
    expA            : TextManager.getter('basic', 9),
    fight           : TextManager.getter('command', 0),
    escape          : TextManager.getter('command', 1),
    attack          : TextManager.getter('command', 2),
    guard           : TextManager.getter('command', 3),
    item            : TextManager.getter('command', 4),
    skill           : TextManager.getter('command', 5),
    equip           : TextManager.getter('command', 6),
    status          : TextManager.getter('command', 7),
    formation       : TextManager.getter('command', 8),
    save            : TextManager.getter('command', 9),
    gameEnd         : TextManager.getter('command', 10),
    options         : TextManager.getter('command', 11),
    weapon          : TextManager.getter('command', 12),
    armor           : TextManager.getter('command', 13),
    keyItem         : TextManager.getter('command', 14),
    equip2          : TextManager.getter('command', 15),
    optimize        : TextManager.getter('command', 16),
    clear           : TextManager.getter('command', 17),
    newGame         : TextManager.getter('command', 18),
    continue_       : TextManager.getter('command', 19),
    toTitle         : TextManager.getter('command', 21),
    cancel          : TextManager.getter('command', 22),
    buy             : TextManager.getter('command', 24),
    sell            : TextManager.getter('command', 25),
    alwaysDash      : TextManager.getter('message', 'alwaysDash'),
    commandRemember : TextManager.getter('message', 'commandRemember'),
    bgmVolume       : TextManager.getter('message', 'bgmVolume'),
    bgsVolume       : TextManager.getter('message', 'bgsVolume'),
    meVolume        : TextManager.getter('message', 'meVolume'),
    seVolume        : TextManager.getter('message', 'seVolume'),
    possession      : TextManager.getter('message', 'possession'),
    expTotal        : TextManager.getter('message', 'expTotal'),
    expNext         : TextManager.getter('message', 'expNext'),
    saveMessage     : TextManager.getter('message', 'saveMessage'),
    loadMessage     : TextManager.getter('message', 'loadMessage'),
    file            : TextManager.getter('message', 'file'),
    partyName       : TextManager.getter('message', 'partyName'),
    emerge          : TextManager.getter('message', 'emerge'),
    preemptive      : TextManager.getter('message', 'preemptive'),
    surprise        : TextManager.getter('message', 'surprise'),
    escapeStart     : TextManager.getter('message', 'escapeStart'),
    escapeFailure   : TextManager.getter('message', 'escapeFailure'),
    victory         : TextManager.getter('message', 'victory'),
    defeat          : TextManager.getter('message', 'defeat'),
    obtainExp       : TextManager.getter('message', 'obtainExp'),
    obtainGold      : TextManager.getter('message', 'obtainGold'),
    obtainItem      : TextManager.getter('message', 'obtainItem'),
    levelUp         : TextManager.getter('message', 'levelUp'),
    obtainSkill     : TextManager.getter('message', 'obtainSkill'),
    useItem         : TextManager.getter('message', 'useItem'),
    criticalToEnemy : TextManager.getter('message', 'criticalToEnemy'),
    criticalToActor : TextManager.getter('message', 'criticalToActor'),
    actorDamage     : TextManager.getter('message', 'actorDamage'),
    actorRecovery   : TextManager.getter('message', 'actorRecovery'),
    actorGain       : TextManager.getter('message', 'actorGain'),
    actorLoss       : TextManager.getter('message', 'actorLoss'),
    actorDrain      : TextManager.getter('message', 'actorDrain'),
    actorNoDamage   : TextManager.getter('message', 'actorNoDamage'),
    actorNoHit      : TextManager.getter('message', 'actorNoHit'),
    enemyDamage     : TextManager.getter('message', 'enemyDamage'),
    enemyRecovery   : TextManager.getter('message', 'enemyRecovery'),
    enemyGain       : TextManager.getter('message', 'enemyGain'),
    enemyLoss       : TextManager.getter('message', 'enemyLoss'),
    enemyDrain      : TextManager.getter('message', 'enemyDrain'),
    enemyNoDamage   : TextManager.getter('message', 'enemyNoDamage'),
    enemyNoHit      : TextManager.getter('message', 'enemyNoHit'),
    evasion         : TextManager.getter('message', 'evasion'),
    magicEvasion    : TextManager.getter('message', 'magicEvasion'),
    magicReflection : TextManager.getter('message', 'magicReflection'),
    counterAttack   : TextManager.getter('message', 'counterAttack'),
    substitute      : TextManager.getter('message', 'substitute'),
    buffAdd         : TextManager.getter('message', 'buffAdd'),
    debuffAdd       : TextManager.getter('message', 'debuffAdd'),
    buffRemove      : TextManager.getter('message', 'buffRemove'),
    actionFailure   : TextManager.getter('message', 'actionFailure'),
});

TextManager.getSkillName = function(id) {
    if ($dataText != null){
        return $dataText['skillsName'][id];
    }
    return $dataSkills[id].name;
}

TextManager.getSkillDescription = function(id) {
    if ($dataText != null){
        return $dataText['skillsDescription'][id];
    }
    return $dataSkills[id].description;
}

TextManager.getItemName = function(id) {
    if ($dataText != null){
        return $dataText['itemsName'][id];
    }
    return $dataItems[id].name;
}

TextManager.getItemNote = function(id) {
    if ($dataText != null){
        return $dataText['itemsNote'][id];
    }
    return $dataItems[id].note;
}

TextManager.getItemDescription = function(id) {
    if ($dataText != null){
        return $dataText['itemsDescription'][id];
    }
    return $dataItems[id].description;
}

TextManager.getWeaponName = function(id) {
    if ($dataText != null){
        return $dataText['weaponsName'][id];
    }
    return $dataWeapons[id].name;
}

TextManager.getWeaponDescription = function(id) {
    if ($dataText != null){
        return $dataText['weaponsDescription'][id];
    }
    return $dataWeapons[id].description;
}

TextManager.getStateName = function(id) {
    if ($dataText != null){
        return $dataText['statesName'][id];
    }
    return $dataStates[id].name;
}

TextManager.getStateMessage1 = function(id) {
    if ($dataText != null){
        return $dataText['statesMessage1'][id];
    }
    return $dataStates[id].message1;
}

TextManager.getStateMessage2 = function(id) {
    if ($dataText != null){
        return $dataText['statesMessage2'][id];
    }
    return $dataStates[id].message2;
}

TextManager.getStateMessage3 = function(id) {
    if ($dataText != null){
        // 2つだけなので英語は直に返す
        if (($dataOption.getUserData("language") == LanguageType.English)){        
            if (id == 208){ // MPダメージのダメージ
                return "Damage";
            }
            if (id == 229){
                return "+2 SPD"; //徐々に素早さアップ
            }
        }
        return $dataText['statesMessage3'][id];
    }
    return $dataStates[id].message3;
}

TextManager.getStateMessage4 = function(id) {
    if ($dataText != null){
        return $dataText['statesMessage4'][id];
    }
    return $dataStates[id].message4;
}

TextManager.getEnemyName = function(id) {
    if ($dataText != null){
        return $dataText['enemiesName'][id];
    }
    return $dataEnemies[id].name;
}

TextManager.getTroopName = function(id) {
    if ($dataText != null){
        return $dataText['troopsName'][id];
    }
    return $dataTroops[id].name;
}

TextManager.getDamageElement = function(id) {
    if ($dataText != null){
        return $dataText['systemElements'][id];
    }
    return $dataSystem.elements[id];
}

TextManager.getText = function(id) {
    return $gameText.getText(id);
}

TextManager.getDecideText = function() {
    return $gameText.getDecideText();
}

TextManager.getCancelText = function() {
    return $gameText.getCancelText();
}

TextManager.getMenuText = function() {
    return $gameText.getMenuText();
}

TextManager.getBackText = function() {
    return $gameText.getBackText();
}

TextManager.getNewText = function() {
    return $gameText.getNewText();
}

TextManager.convertEscapeCharacters = function(text) {
    text = text.replace(/\\/g, '\x1b');
    text = text.replace(/\x1b\x1b/g, '\\');
    text = text.replace(/\x1bp/gi, $gameSystem._userName);
    text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
        return $gameVariables.value(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bV\[(\d+)\]/gi, function() {
        return $gameVariables.value(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bN\[(\d+)\]/gi, function() {
        return this.actorName(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bP\[(\d+)\]/gi, function() {
        return this.partyMemberName(parseInt(arguments[1]));
    }.bind(this));
    text = text.replace(/\x1bG/gi, TextManager.currencyUnit);
    return text;
};

TextManager.convertEscapeMessages = function(text) {

    return text;

}

TextManager.convertControlCharacters = function(text) {
    text = text.replace(/\x1b./g, '');
    text = text.replace(/\x1b|/g, '');
    text = text.replace(/\x1b^/g, '');
    return text;
};

TextManager.convertLogtext = function(logText,actorName) {
    logText.forEach((text,index) => {
        if (text == "") return;
        text = this.convertEscapeCharacters(text);
        text = this.convertControlCharacters(text);
        if (index == 0){
            if (Window_BackLog._lastActorName != actorName){
                Window_BackLog._logData.push({name:true,logText: actorName});
            }
            Window_BackLog._lastActorName = actorName;
        }
        Window_BackLog._logData.push({name:false,logText: text});
    });
};

TextManager.actorName = function(n) {
    const actor = n >= 1 ? $gameActors.actor(n) : null;
    if ($dataText != null){
        return $dataText['actorsName'][actor.actorId()];
    }
    return actor ? $dataActors[actor.actorId()].name : '';
};

TextManager.mapInfosName = function(n) {
    if ($dataText != null){
        return $dataText['mapinfosName'][n];
    }
    return $dataMapInfos[n].name;
};


TextManager.getMaterialTitle = function(n) {
    if ($dataText != null){
        return $dataText['materialTitle'][n];
    }
    return "";
};

TextManager.getMaterialText = function(n) {
    if ($dataText != null){
        return $dataText['materialText'][n];
    }
    return "";
};

TextManager.getTipsText = function(n) {
    if ($dataText != null){
        return $dataText['tipsText'][n];
    }
    return "";
};

TextManager.getTipsHelpText = function(n) {
    if ($dataText != null){
        return $dataText['tipsHelpText'][n];
    }
    return "";
};

TextManager.getQuizQuestion = function(n) {
    if ($dataText != null){
        return $dataText['quizQuestion'][n];
    }
    return "";
};

TextManager.getQuizChoices = function(n) {
    if ($dataText != null){
        return $dataText['quizChoices'][n];
    }
    return "";
};

TextManager.getHelpText = function(n) {
    if ($dataText != null){
        return $dataText['helpText'][n];
    }
    return "";
};