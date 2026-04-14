package com.rts.cap.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

/**
 * @author surya.boobalan
 * @since 19-07-2024
 * @version 1.0
 */

public class LevelThreeLearningAssessment {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
 
    private int totalNumberOfQuestions;
    private int passMarks;
    
    @OneToMany(mappedBy = "levelThreeLearningAssessment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<ChosenQuestion> chosenQuestions;
    
    @OneToOne
    private Assessment assessment;

}
