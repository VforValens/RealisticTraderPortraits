import { PreAkiModLoader } from "@spt-aki/loaders/PreAkiModLoader";
import { IPreAkiLoadMod } from "@spt-aki/models/external/IPreAkiLoadMod";
import { ILogger } from "@spt-aki/models/spt/utils/ILogger";
import { ImageRouter } from "@spt-aki/routers/ImageRouter";
import { DatabaseServer } from "@spt-aki/servers/DatabaseServer";
import { DependencyContainer } from "tsyringe";

class ValensRealisticTraderPortraits implements IPreAkiLoadMod {
    mod: string;
    logger: ILogger;
    databaseServer: DatabaseServer;

    constructor() {
        this.mod = "ValensRealisticTraderPortraits"; // Set name of mod so we can log it to console later
    }

    /**
     * Some work needs to be done prior to SPT code being loaded, registering the profile image + setting trader update time inside the trader config json
     * @param container Dependency container
     */
    public preAkiLoad(container: DependencyContainer): void {
        this.databaseServer = container.resolve<DatabaseServer>("DatabaseServer");
        this.logger = container.resolve<ILogger>("WinstonLogger");
        this.logger.debug(`[${this.mod}] preAki Loading... `);

        const preAkiModLoader: PreAkiModLoader = container.resolve<PreAkiModLoader>("PreAkiModLoader");
        const imageRouter: ImageRouter = container.resolve<ImageRouter>("ImageRouter");
        
        this.registerProfileImage(preAkiModLoader, imageRouter);        
        this.logger.debug(`[${this.mod}] preAki Loaded`);
    }
    
    /**
     * Add profile picture to our trader
     * @param preAkiModLoader mod loader class - used to get the mods file path
     * @param imageRouter image router class - used to register the trader image path so we see their image on trader page
     */
    private registerProfileImage(preAkiModLoader: PreAkiModLoader, imageRouter: ImageRouter): void
    {
        // Reference the mod "res" folder
        const imageFilepath = `./${preAkiModLoader.getModPath(this.mod)}src/traders`;
        const db = this.databaseServer.getTables().traders;

        // Register a route to point to the profile picture
        imageRouter.addRoute(db["54cb50c76803fa8b248b4571"].base.avatar.replace(".jpg", ""), `${imageFilepath}/prapor.png`);
    }
}

module.exports = { mod: new ValensRealisticTraderPortraits() }