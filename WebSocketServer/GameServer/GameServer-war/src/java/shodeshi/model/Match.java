/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package shodeshi.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObjectBuilder;

/**
 *
 * @author tyang
 */
public class Match {

    private List<User> onlineUsers;
    private List<User> playingUsers;
    /*
     * 棋盘上所有位置, 初始值为0:
     * /|\ 
     *  |  (2,0) (2,1) (2,2)
     *  |  (1,0) (1,1) (1,2)
     *  |  (0,0) (0,1) (0,2)
     *  +-------------------->
     */
    private int[][] boardArr;
    //已下棋子集合
    private List<Chess> chessList;

    public Match() {
        onlineUsers = new ArrayList<User>();
        playingUsers = new ArrayList<User>();
        chessList = new ArrayList<Chess>();
    }

    public void addOnlineUser(User user) {
        getOnlineUsers().add(user);
    }

    public void addPlayingUser(User user) {
        getPlayingUsers().add(user);
    }

    public void resetMatch() {
        getPlayingUsers().clear();
        getChessList().clear();
    }

    public List<User> getOnlineUsers() {
        return onlineUsers;
    }

    public List<User> getPlayingUsers() {
        return playingUsers;
    }

    public List<Chess> getChessList() {
        return chessList;
    }

    public JsonObjectBuilder buildJsonObject() {
        JsonObjectBuilder objBuilder = Json.createObjectBuilder();
        //build playing users json array
        JsonArrayBuilder arrBuilder = Json.createArrayBuilder();
        for (User user : getPlayingUsers()) {
            arrBuilder.add(user.getUserName());
        }
        objBuilder.add("playingUsers", arrBuilder);
        //build online users json array
        arrBuilder = Json.createArrayBuilder();
        for (User user : getOnlineUsers()) {
            arrBuilder.add(user.getUserName());
        }
        objBuilder.add("onlineUsers", arrBuilder);
        //build chess json array
        arrBuilder = Json.createArrayBuilder();
        for (Chess chess : getChessList()) {
            JsonObjectBuilder chessBuilder = Json.createObjectBuilder();
            chessBuilder.add("positionX", chess.getPositionX());
            chessBuilder.add("positionY", chess.getPositionY());
            arrBuilder.add(chessBuilder);
        }
        objBuilder.add("chessArr", arrBuilder);
        return objBuilder;
    }
}
