import { OnInit, Service } from "@flamework/core";
import { HttpService as HTTP } from "@rbxts/services";
import { Events } from "server/network";
import { $env } from "rbxts-transform-env";

@Service({})
export class LoggingService implements OnInit {
  private readonly url = $env.string("LOG_WEBHOOK")!;

  public onInit(): void {
    Events.discordLog.connect((plr, msg, logType) => this.log(plr, msg, logType));
  }

  /**
   * Log to Discord
   * 
   * @param player Player
   * @param message Message
   * @param logType Log type
   */
  public log(player: Player, message: string, logType: string): void {
    // if (Runtime.IsStudio()) return;
    const data = HTTP.JSONEncode({
      username: "Blackout Logs",
      embeds: [
        {
          title: logType,
          author: {
            name: player.Name,
            //icon_url: thumb,
            url: "https://www.roblox.com/users/" + player.UserId + "/profile"
          },
          description: message,
          timestamp: DateTime.now().ToIsoDate(),
          color: 0xE09F36
        }
      ]
    });
    xpcall(() => HTTP.PostAsync(this.url, data), warn);
  }
}
