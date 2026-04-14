package com.rts.cap.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

/**
 * @author prasanth.baskaran 
 * @since 28-06-2024
 * @version 1.0
 */


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class QuestionDto{
	
    private String content;
    private String complexity;
    private String questionType;
    private String topicName;
    private String subtopicName;
    private int mark;
    private String[] optionContents;
    private String[] correctOptions;
    
    public boolean isEmpty() {
        return this.content.isEmpty() && this.optionContents.length == 0;
    }
 
}
