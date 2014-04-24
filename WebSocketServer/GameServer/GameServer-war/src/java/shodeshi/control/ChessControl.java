/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package shodeshi.control;

import java.util.ArrayList;
import java.util.List;
import shodeshi.model.Match;

/**
 *
 * @author tyang
 */
public class ChessControl {
//    public static int playerCount = 0;
//    public static List<User> playingUsers = new ArrayList<User>();
//    public static List<User> onlineUsers = new ArrayList<User>();

    private static ChessControl instance;
    private List<Match> matches;

    private ChessControl() {
        matches = new ArrayList<Match>();
    }

    public static ChessControl getInstance() {
        if (instance == null) {
            instance = new ChessControl();
        }
        return instance;
    }

    public Match getMatch() {
        if (matches.isEmpty()) {
            matches.add(new Match());
        }
        return matches.get(0);
    }
}
