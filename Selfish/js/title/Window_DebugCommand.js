//-----------------------------------------------------------------------------
// Window_DebugCommand
//

class Window_DebugCommand extends Window_Command{
    constructor(){
        super(new Rectangle( 0, 0, 540, 540 ));
        this.x = 0;
        this.y = 0;
        this.hide();
        this.deactivate();
    }

    itemTextAlign(){
        return 'center';
    }

    makeCommandList(){
        this.addCommand("イベントデータ出力",   'outputeventfile');
        this.addCommand("テキストデータ出力",   'outputtextdata');
        this.addCommand("Csvから英語版テキスト出力",   'csvtotextdata');
        this.addCommand("Csvから英語版イベントを出力",   'csvtoeventdata');
        this.addCommand("スクリプト圧縮",   'scriptminify');
        //this.addCommand("アクターテキスト出力" , 'outputactorstext');
        
        //this.addCommand("バージョンアップテスト",   'versioncheck');
        //this.addCommand("リソースダウンロード",   'resourcedownload');
        //this.addCommand("Twitter連携テスト",   'twitterApply');
        
        this.addCommand("Steam-Window版をデプロイ",   'deploysteamwin');
        this.addCommand("Steam-Mac版をデプロイ",   'deploysteammac');
        this.addCommand("DLSite-Window版をデプロイ",   'deploydlsitewin');
        this.addCommand("DLSite-Mac版をデプロイ",   'deploydlsitemac');
        this.addCommand("Android版をデプロイ",   'deployandroid');
        this.addCommand("iOS版をデプロイ",   'deployios');
        this.addCommand("アセットを更新",   'outputDeployAssetOnly');
        this.addCommand("全部一括でを更新",   'outputDeployAll');
    }
}