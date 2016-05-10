package nl.toefel.bookies.acceptancetest;

import com.google.gson.Gson;

import java.lang.reflect.Type;
import java.util.List;
import java.util.Map;

import static javafx.scene.input.KeyCode.M;

/**
 * Utility functions that make code easier to read.
 *
 * @author Christophe Hesters
 */
public class GsonHelper {
    /** Converts a json string to a List with objects */
    public static List fromJsonList(String jsonString) {
        return new Gson().fromJson(jsonString, List.class);
    }

    /** Converts a json string to a Map  */
    public static Map fromJsonMap(String jsonString) {
        return new Gson().fromJson(jsonString, Map.class);
    }

    /**
     * Usage: {@code
     * Collection<Integer> ints2 = fromJson(json, new TypeToken<Collection<Integer>>(){}.getType());
     * }
     *
     * Type inference based on return type
     */
    public static <T> T fromJson(String jsonString, Type type) {
        return new Gson().fromJson(jsonString, type);
    }

    public static String toJson(Object object) {
        return new Gson().toJson(object);
    }

}
